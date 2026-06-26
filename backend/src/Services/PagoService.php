<?php

namespace App\Services;

use App\DTO\PagoDTO;
use App\Repositories\CitaDAO;
use App\Repositories\PagoDAO;
use App\Database\Database;
use Exception;
use InvalidArgumentException;
use RuntimeException;
use Throwable;

/**
 * PagoService — Service Layer para pagos
 *
 * Lógica de negocio detectada en el código original:
 *   - Al registrar un pago "Completado", la cita pasa a "Completada"
 *   - Todo ocurre en una transacción (si uno falla, se revierte todo)
 */
class PagoService
{
    private PagoDAO $pagoDAO;
    private CitaDAO $citaDAO;

    public function __construct()
    {
        $this->pagoDAO = new PagoDAO();
        $this->citaDAO = new CitaDAO();
    }

    /**
     * Registrar un pago con transacción atómica.
     *
     * Reglas de negocio:
     *  - id_cita, monto, metodo_pago, estado y fecha_pago son obligatorios
     *  - El monto debe ser mayor a 0
     *  - Si el estado es "Pagado", la cita asociada pasa a "Completada"
     *
     * @throws InvalidArgumentException si los datos son inválidos
     */
    public function registrar(array $data): array
    {
        // ── Validaciones ──────────────────────────────────────────────────
        $required = ['id_cita', 'monto', 'metodo_pago', 'estado', 'fecha_pago'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                throw new InvalidArgumentException("Campo requerido: {$field}", 400);
            }
        }

        $monto = filter_var($data['monto'], FILTER_VALIDATE_FLOAT);
        if ($monto === false || $monto <= 0) {
            throw new InvalidArgumentException('El monto debe ser un número mayor a 0.', 400);
        }

        $estadosValidos = ['Pendiente', 'Parcial', 'Pagado', 'Anulado'];
        if (!in_array($data['estado'], $estadosValidos, true)) {
            throw new InvalidArgumentException("Estado de pago inválido: {$data['estado']}", 400);
        }

        // ── Verificar que la cita existe ──────────────────────────────────
        $cita = $this->citaDAO->findById((int) $data['id_cita']);
        if (!$cita) {
            throw new RuntimeException('La cita especificada no existe.', 404);
        }

        // ── Construir DTO ─────────────────────────────────────────────────
        // Normalizar formato de fecha (acepta 'YYYY-MM-DDTHH:MM' o 'YYYY-MM-DD HH:MM')
        $fechaPago = str_replace('T', ' ', $data['fecha_pago']);
        if (strlen($fechaPago) === 16) {
            $fechaPago .= ':00'; // agregar segundos si no vienen
        }

        $idPago = $data['id_pago'] ?? null;
        
        $dto = PagoDTO::fromArray([
            'id_pago'     => $idPago ? (int) $idPago : null,
            'id_cita'     => (int) $data['id_cita'],
            'monto'       => $monto,
            'metodo_pago' => $data['metodo_pago'],
            'estado'      => $data['estado'],
            'referencia'  => $data['referencia'] ?? null,
            'fecha_pago'  => $fechaPago,
            'notas'       => $data['notas'] ?? null,
        ]);

        // ── Transacción: insertar/actualizar pago + actualizar cita si aplica ────────
        $conn = Database::getInstance()->getConnection();
        $conn->beginTransaction();

        try {
            if ($idPago) {
                $this->pagoDAO->update($dto);
            } else {
                $idPago = $this->pagoDAO->save($dto);
            }

            if ($data['estado'] === 'Pagado' || $data['estado'] === 'Parcial') {
                $citaExistente = $this->citaDAO->findById((int) $data['id_cita']);
                if ($citaExistente && $citaExistente->estado === 'Pendiente') {
                    $this->citaDAO->updateEstado((int) $data['id_cita'], 'Confirmada');
                }
            }

            $conn->commit();
        } catch (Throwable $e) {
            $conn->rollBack();
            throw new RuntimeException('Error al registrar el pago: ' . $e->getMessage(), 500);
        }

        return [
            'success' => true,
            'id'      => $idPago,
            'message' => 'Pago registrado exitosamente.',
        ];
    }

    /**
     * Listar pagos de un paciente.
     *
     * @return PagoDTO[]
     */
    public function listarPorPaciente(int $idPaciente): array
    {
        return $this->pagoDAO->findByPaciente($idPaciente);
    }

    /**
     * Total recaudado en un rango de fechas (para reportes).
     */
    public function totalRecaudado(string $desde, string $hasta): float
    {
        return $this->pagoDAO->sumByFecha($desde, $hasta);
    }

    /**
     * Anular un pago existente.
     */
    public function anular(int $idPago): array
    {
        $pago = $this->pagoDAO->findById($idPago);
        if (!$pago) {
            throw new RuntimeException('Pago no encontrado.', 404);
        }
        if ($pago->estado === 'Anulado') {
            throw new RuntimeException('El pago ya está anulado.', 422);
        }

        $dto = PagoDTO::fromArray([
            'id_pago'     => $pago->id,
            'id_cita'     => $pago->idCita,
            'monto'       => $pago->monto,
            'metodo_pago' => $pago->metodoPago,
            'estado'      => 'Anulado',
            'referencia'  => $pago->referencia,
            'fecha_pago'  => $pago->fechaPago,
            'notas'       => $pago->notas,
        ]);

        return ['success' => true, 'message' => 'Pago anulado.'];
    }

    /**
     * Anular todos los pagos asociados a una cita (Reembolso por cancelación).
     */
    public function anularPorCita(int $idCita): void
    {
        $conn = Database::getInstance()->getConnection();
        $stmt = $conn->prepare("
            UPDATE pagos 
            SET estado = 'Reembolsado', 
                notas = CONCAT(COALESCE(notas,''), ' [Reembolsado por cancelación de cita]') 
            WHERE id_cita = :id_cita AND estado NOT IN ('Anulado', 'Reembolsado')
        ");
        $stmt->execute([':id_cita' => $idCita]);
    }
}
