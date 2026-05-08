<?php

require_once __DIR__ . '/../dao/DAOInterface.php';
require_once __DIR__ . '/../dto/CitaDTO.php';
require_once __DIR__ . '/../database/conexion.php';

/**
 * CitaDAO — Data Access Object para citas
 *
 * Concentra TODAS las consultas SQL relacionadas con citas.
 * Ningún otro archivo del proyecto debería escribir SQL sobre la tabla `citas`.
 *
 * Recibe y devuelve CitaDTO — nunca arrays crudos.
 *
 * Antes (disperso en 10+ archivos):
 *   $stmt = $conn->prepare("SELECT * FROM citas WHERE ...");
 *
 * Ahora (centralizado aquí):
 *   $citas = (new CitaDAO())->findByDentista($idDentista);
 */
class CitaDAO implements DAOInterface
{
    private PDO $conn;

    public function __construct()
    {
        $this->conn = Database::getInstance()->getConnection();
    }

    // ── CRUD base ─────────────────────────────────────────────────────────

    /**
     * Buscar una cita por ID.
     */
    public function findById(int $id): ?CitaDTO
    {
        $stmt = $this->conn->prepare('
            SELECT c.*, 
                   p.id_paciente,
                   u.nombre_apellido AS nombre_paciente,
                   t.nombre          AS nombre_tratamiento,
                   d.id_dentista,
                   ud.nombre_apellido AS nombre_dentista
            FROM citas c
            JOIN pacientes p   ON c.id_paciente   = p.id_paciente
            JOIN usuarios u    ON p.id_usuario     = u.id_usuario
            JOIN tratamientos t ON c.id_tratamiento = t.id_tratamiento
            LEFT JOIN dentistas d  ON c.id_dentista  = d.id_dentista
            LEFT JOIN usuarios ud  ON d.id_usuario   = ud.id_usuario
            WHERE c.id_cita = :id
            LIMIT 1
        ');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();

        return $row ? CitaDTO::fromArray($row) : null;
    }

    /**
     * Devolver todas las citas (con paginación opcional).
     *
     * @return CitaDTO[]
     */
    public function findAll(int $limit = 50, int $offset = 0): array
    {
        $stmt = $this->conn->prepare('
            SELECT c.*,
                   u.nombre_apellido  AS nombre_paciente,
                   t.nombre           AS nombre_tratamiento,
                   ud.nombre_apellido AS nombre_dentista
            FROM citas c
            JOIN pacientes p    ON c.id_paciente   = p.id_paciente
            JOIN usuarios u     ON p.id_usuario     = u.id_usuario
            JOIN tratamientos t ON c.id_tratamiento = t.id_tratamiento
            LEFT JOIN dentistas d  ON c.id_dentista = d.id_dentista
            LEFT JOIN usuarios ud  ON d.id_usuario  = ud.id_usuario
            ORDER BY c.fecha_hora DESC
            LIMIT :limit OFFSET :offset
        ');
        $stmt->bindValue(':limit',  $limit,  PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        return array_map(
            fn($row) => CitaDTO::fromArray($row),
            $stmt->fetchAll()
        );
    }

    /**
     * Insertar una nueva cita. Devuelve el ID generado.
     */
    public function save(mixed $dto): int
    {
        /** @var CitaDTO $dto */
        $stmt = $this->conn->prepare('
            INSERT INTO citas (
                id_paciente, id_tratamiento, id_dentista,
                fecha_hora, duracion, estado,
                notas, recordatorio_enviado, creado_por
            ) VALUES (
                :id_paciente, :id_tratamiento, :id_dentista,
                :fecha_hora, :duracion, :estado,
                :notas, :recordatorio_enviado, :creado_por
            )
        ');

        $stmt->execute($dto->toArray());
        return (int) $this->conn->lastInsertId();
    }

    /**
     * Actualizar una cita existente.
     */
    public function update(CitaDTO $dto): bool
    {
        $stmt = $this->conn->prepare('
            UPDATE citas SET
                id_tratamiento       = :id_tratamiento,
                id_dentista          = :id_dentista,
                fecha_hora           = :fecha_hora,
                duracion             = :duracion,
                estado               = :estado,
                notas                = :notas,
                recordatorio_enviado = :recordatorio_enviado
            WHERE id_cita = :id
        ');

        return $stmt->execute([
            ':id'                  => $dto->id,
            ':id_tratamiento'      => $dto->idTratamiento,
            ':id_dentista'         => $dto->idDentista,
            ':fecha_hora'          => $dto->fechaHora,
            ':duracion'            => $dto->duracion,
            ':estado'              => $dto->estado,
            ':notas'               => $dto->notas,
            ':recordatorio_enviado'=> $dto->recordatorioEnviado,
        ]);
    }

    /**
     * Eliminar una cita por ID.
     */
    public function delete(int $id): bool
    {
        $stmt = $this->conn->prepare(
            'DELETE FROM citas WHERE id_cita = :id'
        );
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount() > 0;
    }

    // ── Consultas específicas ──────────────────────────────────────────────

    /**
     * Citas de un dentista específico, con filtro de fecha opcional.
     *
     * @return CitaDTO[]
     */
    public function findByDentista(int $idDentista, ?string $fecha = null): array
    {
        $sql = '
            SELECT c.*,
                   u.nombre_apellido AS nombre_paciente,
                   t.nombre          AS nombre_tratamiento
            FROM citas c
            JOIN pacientes p    ON c.id_paciente   = p.id_paciente
            JOIN usuarios u     ON p.id_usuario     = u.id_usuario
            JOIN tratamientos t ON c.id_tratamiento = t.id_tratamiento
            WHERE c.id_dentista = :id_dentista
        ';

        $params = [':id_dentista' => $idDentista];

        if ($fecha) {
            $sql .= ' AND DATE(c.fecha_hora) = :fecha';
            $params[':fecha'] = $fecha;
        }

        $sql .= ' ORDER BY c.fecha_hora ASC';

        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);

        return array_map(
            fn($row) => CitaDTO::fromArray($row),
            $stmt->fetchAll()
        );
    }

    /**
     * Citas de un paciente específico.
     *
     * @return CitaDTO[]
     */
    public function findByPaciente(int $idPaciente): array
    {
        $stmt = $this->conn->prepare('
            SELECT c.*,
                   t.nombre          AS nombre_tratamiento,
                   ud.nombre_apellido AS nombre_dentista
            FROM citas c
            JOIN tratamientos t ON c.id_tratamiento = t.id_tratamiento
            LEFT JOIN dentistas d  ON c.id_dentista = d.id_dentista
            LEFT JOIN usuarios ud  ON d.id_usuario  = ud.id_usuario
            WHERE c.id_paciente = :id_paciente
            ORDER BY c.fecha_hora DESC
        ');
        $stmt->execute([':id_paciente' => $idPaciente]);

        return array_map(
            fn($row) => CitaDTO::fromArray($row),
            $stmt->fetchAll()
        );
    }

    /**
     * Cambiar solo el estado de una cita (Pendiente→Confirmada→Completada, etc.)
     */
    public function updateEstado(int $id, string $estado): bool
    {
        $stmt = $this->conn->prepare(
            'UPDATE citas SET estado = :estado WHERE id_cita = :id'
        );
        return $stmt->execute([':estado' => $estado, ':id' => $id]);
    }

    /**
     * Contar citas de hoy (para el dashboard).
     */
    public function countHoy(): int
    {
        $stmt = $this->conn->query(
            "SELECT COUNT(*) FROM citas WHERE DATE(fecha_hora) = CURDATE()"
        );
        return (int) $stmt->fetchColumn();
    }

    /**
     * Contar citas de una fecha específica.
     */
    public function contarPorFecha(string $fecha): int
    {
        $stmt = $this->conn->prepare(
            "SELECT COUNT(*) FROM citas WHERE DATE(fecha_hora) = :fecha"
        );
        $stmt->execute([':fecha' => $fecha]);
        return (int) $stmt->fetchColumn();
    }
}
