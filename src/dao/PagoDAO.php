<?php

require_once __DIR__ . '/../dao/DAOInterface.php';
require_once __DIR__ . '/../dto/PagoDTO.php';
require_once __DIR__ . '/../database/conexion.php';

/**
 * PagoDAO — Data Access Object para pagos
 */
class PagoDAO implements DAOInterface
{
    private PDO $conn;

    public function __construct()
    {
        $this->conn = Database::getInstance()->getConnection();
    }

    // ── CRUD base ─────────────────────────────────────────────────────────

    public function findById(int $id): ?PagoDTO
    {
        $stmt = $this->conn->prepare('
            SELECT p.*,
                   c.fecha_hora      AS fecha_cita,
                   c.estado          AS estado_cita,
                   u.nombre_apellido AS nombre_paciente
            FROM pagos p
            JOIN citas c    ON p.id_cita    = c.id_cita
            JOIN pacientes pa ON c.id_paciente = pa.id_paciente
            JOIN usuarios u   ON pa.id_usuario  = u.id_usuario
            WHERE p.id_pago = :id
            LIMIT 1
        ');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();

        return $row ? PagoDTO::fromArray($row) : null;
    }

    /**
     * @return PagoDTO[]
     */
    public function findAll(int $limit = 50, int $offset = 0): array
    {
        $stmt = $this->conn->prepare('
            SELECT p.*,
                   u.nombre_apellido AS nombre_paciente
            FROM pagos p
            JOIN citas c      ON p.id_cita     = c.id_cita
            JOIN pacientes pa ON c.id_paciente  = pa.id_paciente
            JOIN usuarios u   ON pa.id_usuario  = u.id_usuario
            ORDER BY p.fecha_pago DESC
            LIMIT :limit OFFSET :offset
        ');
        $stmt->bindValue(':limit',  $limit,  PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        return array_map(fn($r) => PagoDTO::fromArray($r), $stmt->fetchAll());
    }

    /**
     * Insertar nuevo pago. Devuelve el id_pago generado.
     */
    public function save(mixed $dto): int
    {
        /** @var PagoDTO $dto */
        $stmt = $this->conn->prepare('
            INSERT INTO pagos (
                id_cita, monto, metodo_pago,
                estado, referencia, fecha_pago, notas
            ) VALUES (
                :id_cita, :monto, :metodo_pago,
                :estado, :referencia, :fecha_pago, :notas
            )
        ');
        $stmt->execute($dto->toArray());
        return (int) $this->conn->lastInsertId();
    }

    /**
     * Actualizar un pago existente.
     */
    public function update(PagoDTO $dto): bool
    {
        $stmt = $this->conn->prepare('
            UPDATE pagos SET
                monto       = :monto,
                metodo_pago = :metodo_pago,
                estado      = :estado,
                referencia  = :referencia,
                fecha_pago  = :fecha_pago,
                notas       = :notas
            WHERE id_pago = :id
        ');

        return $stmt->execute([
            ':id'          => $dto->id,
            ':monto'       => $dto->monto,
            ':metodo_pago' => $dto->metodoPago,
            ':estado'      => $dto->estado,
            ':referencia'  => $dto->referencia,
            ':fecha_pago'  => $dto->fechaPago,
            ':notas'       => $dto->notas,
        ]);
    }

    public function delete(int $id): bool
    {
        $stmt = $this->conn->prepare(
            'DELETE FROM pagos WHERE id_pago = :id'
        );
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount() > 0;
    }

    // ── Consultas específicas ──────────────────────────────────────────────

    /**
     * Pagos de un paciente específico.
     *
     * @return PagoDTO[]
     */
    public function findByPaciente(int $idPaciente): array
    {
        $stmt = $this->conn->prepare('
            SELECT p.*
            FROM pagos p
            JOIN citas c ON p.id_cita = c.id_cita
            WHERE c.id_paciente = :id_paciente
            ORDER BY p.fecha_pago DESC
        ');
        $stmt->execute([':id_paciente' => $idPaciente]);

        return array_map(fn($r) => PagoDTO::fromArray($r), $stmt->fetchAll());
    }

    /**
     * Total recaudado en un rango de fechas (para reportes).
     */
    public function sumByFecha(string $desde, string $hasta): float
    {
        $stmt = $this->conn->prepare('
            SELECT COALESCE(SUM(monto), 0)
            FROM pagos
            WHERE estado    = "Pagado"
              AND fecha_pago BETWEEN :desde AND :hasta
        ');
        $stmt->execute([':desde' => $desde, ':hasta' => $hasta]);
        return (float) $stmt->fetchColumn();
    }

    /**
     * Total recaudado en un mes específico (formato: YYYY-MM).
     */
    public function totalPorMes(string $mesAño): float
    {
        $stmt = $this->conn->prepare('
            SELECT COALESCE(SUM(monto), 0)
            FROM pagos
            WHERE estado    = "Pagado"
              AND DATE_FORMAT(fecha_pago, "%Y-%m") = :mes
        ');
        $stmt->execute([':mes' => $mesAño]);
        return (float) $stmt->fetchColumn();
    }
}
