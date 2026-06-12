<?php

namespace App\Controllers;

use App\Services\PagoService;
use App\Repositories\PagoDAO;
use Exception;

/**
 * PagoController — Controlador para la gestión de pagos
 */
class PagoController
{
    private PagoService $pagoService;
    private PagoDAO $pagoDAO;

    public function __construct()
    {
        $this->pagoService = new PagoService();
        $this->pagoDAO = new PagoDAO();
    }

    /**
     * Listar todos los pagos (Filtrados por rol)
     */
    public function listar(): array
    {
        $role = \App\Middleware\AuthMiddleware::getUserRole();
        $userId = \App\Middleware\AuthMiddleware::getUserId();

        if ($role === 4) { // PACIENTE
            $pacienteDAO = new \App\Repositories\PacienteDAO();
            $paciente = $pacienteDAO->findByIdUsuario($userId);
            if ($paciente) {
                // Para mantener la consistencia de UI, obtenemos los pagos raw filtrados por id_paciente
                $stmt = \App\Database\Database::getInstance()->getConnection()->prepare('
                    SELECT p.id_pago, p.id_cita, p.monto, p.metodo_pago, p.estado,
                           u.nombre_apellido AS nombre_paciente,
                           t.nombre          AS nombre_tratamiento,
                           t.costo           AS costo_tratamiento
                    FROM pagos p
                    JOIN citas c      ON p.id_cita     = c.id_cita
                    JOIN pacientes pa ON c.id_paciente  = pa.id_paciente
                    JOIN usuarios u   ON pa.id_usuario  = u.id_usuario
                    JOIN tratamientos t ON c.id_tratamiento = t.id_tratamiento
                    WHERE pa.id_paciente = :id_paciente
                    ORDER BY p.fecha_pago DESC
                ');
                $stmt->execute([':id_paciente' => $paciente->id]);
                return $stmt->fetchAll(\PDO::FETCH_ASSOC);
            }
            return [];
        }

        return $this->pagoDAO->findAllRaw();
    }

    /**
     * Registrar un nuevo pago
     */
    public function registrar(array $datos): array
    {
        return $this->pagoService->registrar($datos);
    }

    /**
     * Anular un pago
     */
    public function anular(int $id): array
    {
        return $this->pagoService->anular($id);
    }
}
