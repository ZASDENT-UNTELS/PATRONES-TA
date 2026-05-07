<?php

require_once __DIR__ . '/../dao/DAOInterface.php';
require_once __DIR__ . '/../dto/HistorialMedicoDTO.php';
require_once __DIR__ . '/../database/conexion.php';

/**
 * HistorialMedicoDAO — Data Access Object para historial médico
 */
class HistorialMedicoDAO implements DAOInterface
{
    private PDO $conn;

    public function __construct()
    {
        $this->conn = Database::getInstance()->getConnection();
    }

    // ── CRUD base ─────────────────────────────────────────────────────────

    public function findById(int $id): ?HistorialMedicoDTO
    {
        $stmt = $this->conn->prepare('
            SELECT h.*,
                   u.nombre_apellido  AS nombre_paciente,
                   ud.nombre_apellido AS nombre_dentista,
                   t.nombre           AS nombre_tratamiento
            FROM historial_medico h
            JOIN pacientes p    ON h.id_paciente   = p.id_paciente
            JOIN usuarios u     ON p.id_usuario    = u.id_usuario
            LEFT JOIN dentistas d   ON h.id_dentista  = d.id_dentista
            LEFT JOIN usuarios ud   ON d.id_usuario   = ud.id_usuario
            LEFT JOIN tratamientos t ON h.id_tratamiento = t.id_tratamiento
            WHERE h.id_historial = :id
            LIMIT 1
        ');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();

        return $row ? HistorialMedicoDTO::fromArray($row) : null;
    }

    /**
     * @return HistorialMedicoDTO[]
     */
    public function findAll(int $limit = 50, int $offset = 0): array
    {
        $stmt = $this->conn->prepare('
            SELECT h.*,
                   u.nombre_apellido  AS nombre_paciente,
                   ud.nombre_apellido AS nombre_dentista,
                   t.nombre           AS nombre_tratamiento
            FROM historial_medico h
            JOIN pacientes p     ON h.id_paciente    = p.id_paciente
            JOIN usuarios u      ON p.id_usuario     = u.id_usuario
            LEFT JOIN dentistas d    ON h.id_dentista   = d.id_dentista
            LEFT JOIN usuarios ud    ON d.id_usuario    = ud.id_usuario
            LEFT JOIN tratamientos t ON h.id_tratamiento = t.id_tratamiento
            ORDER BY h.fecha_procedimiento DESC
            LIMIT :limit OFFSET :offset
        ');
        $stmt->bindValue(':limit',  $limit,  PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        return array_map(fn($r) => HistorialMedicoDTO::fromArray($r), $stmt->fetchAll());
    }

    /**
     * Insertar nuevo historial. Devuelve el id_historial generado.
     */
    public function save(mixed $dto): int
    {
        /** @var HistorialMedicoDTO $dto */
        $stmt = $this->conn->prepare('
            INSERT INTO historial_medico (
                id_paciente, id_dentista, id_tratamiento,
                fecha_procedimiento, diagnostico, procedimiento,
                observaciones, receta, proxima_visita
            ) VALUES (
                :id_paciente, :id_dentista, :id_tratamiento,
                :fecha_procedimiento, :diagnostico, :procedimiento,
                :observaciones, :receta, :proxima_visita
            )
        ');
        $stmt->execute($dto->toArray());
        return (int) $this->conn->lastInsertId();
    }

    /**
     * Actualizar un historial existente.
     */
    public function update(HistorialMedicoDTO $dto): bool
    {
        $stmt = $this->conn->prepare('
            UPDATE historial_medico SET
                id_tratamiento      = :id_tratamiento,
                fecha_procedimiento = :fecha_procedimiento,
                diagnostico         = :diagnostico,
                procedimiento       = :procedimiento,
                observaciones       = :observaciones,
                receta              = :receta,
                proxima_visita      = :proxima_visita
            WHERE id_historial = :id
        ');

        return $stmt->execute([
            ':id'                  => $dto->id,
            ':id_tratamiento'      => $dto->idTratamiento,
            ':fecha_procedimiento' => $dto->fechaProcedimiento,
            ':diagnostico'         => $dto->diagnostico,
            ':procedimiento'       => $dto->procedimiento,
            ':observaciones'       => $dto->observaciones,
            ':receta'              => $dto->receta,
            ':proxima_visita'      => $dto->proximaVisita,
        ]);
    }

    public function delete(int $id): bool
    {
        $stmt = $this->conn->prepare(
            'DELETE FROM historial_medico WHERE id_historial = :id'
        );
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount() > 0;
    }

    // ── Consultas específicas ──────────────────────────────────────────────

    /**
     * Historial completo de un paciente, ordenado por fecha.
     *
     * @return HistorialMedicoDTO[]
     */
    public function findByPaciente(int $idPaciente): array
    {
        $stmt = $this->conn->prepare('
            SELECT h.*,
                   ud.nombre_apellido AS nombre_dentista,
                   t.nombre           AS nombre_tratamiento
            FROM historial_medico h
            LEFT JOIN dentistas d    ON h.id_dentista    = d.id_dentista
            LEFT JOIN usuarios ud    ON d.id_usuario     = ud.id_usuario
            LEFT JOIN tratamientos t ON h.id_tratamiento = t.id_tratamiento
            WHERE h.id_paciente = :id_paciente
            ORDER BY h.fecha_procedimiento DESC
        ');
        $stmt->execute([':id_paciente' => $idPaciente]);

        return array_map(fn($r) => HistorialMedicoDTO::fromArray($r), $stmt->fetchAll());
    }

    /**
     * Historiales registrados por un dentista.
     *
     * @return HistorialMedicoDTO[]
     */
    public function findByDentista(int $idDentista): array
    {
        $stmt = $this->conn->prepare('
            SELECT h.*,
                   u.nombre_apellido AS nombre_paciente,
                   t.nombre          AS nombre_tratamiento
            FROM historial_medico h
            JOIN pacientes p     ON h.id_paciente    = p.id_paciente
            JOIN usuarios u      ON p.id_usuario     = u.id_usuario
            LEFT JOIN tratamientos t ON h.id_tratamiento = t.id_tratamiento
            WHERE h.id_dentista = :id_dentista
            ORDER BY h.fecha_procedimiento DESC
        ');
        $stmt->execute([':id_dentista' => $idDentista]);

        return array_map(fn($r) => HistorialMedicoDTO::fromArray($r), $stmt->fetchAll());
    }
}
