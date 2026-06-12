<?php

namespace App\Repositories;

use App\DTO\PacienteDTO;
use App\Database\Database;
use App\Repositories\DAOInterface;
use PDO;




/**
 * PacienteDAO — Data Access Object para pacientes
 *
 * Gestiona las tablas `pacientes` y `usuarios` (siempre juntas,
 * ya que un paciente es siempre un usuario del sistema).
 */
class PacienteDAO implements DAOInterface
{
    private PDO $conn;

    public function __construct()
    {
        $this->conn = Database::getInstance()->getConnection();
    }

    // ── CRUD base ─────────────────────────────────────────────────────────

    /**
     * Buscar un paciente por id_paciente.
     */
    public function findById(int $id): ?PacienteDTO
    {
        $stmt = $this->conn->prepare('
            SELECT p.*, 
                   u.nombre_apellido,
                   u.email,
                   u.telefono,
                   u.usuario_usuario
            FROM pacientes p
            JOIN usuarios u ON p.id_usuario = u.id_usuario
            WHERE p.id_paciente = :id
            LIMIT 1
        ');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();

        return $row ? PacienteDTO::fromArray($row) : null;
    }

    /**
     * Devolver todos los pacientes con paginación y búsqueda opcional.
     *
     * @return array{data: PacienteDTO[], total: int}
     */
    public function findAll(int $limit = 25, int $offset = 0, string $search = ''): array
    {
        $where  = '';
        $params = [];

        if ($search !== '') {
            $where = "WHERE u.nombre_apellido LIKE :search
                         OR u.email           LIKE :search
                         OR u.usuario_usuario LIKE :search";
            $params[':search'] = "%{$search}%";
        }

        // Total de registros (para paginación)
        $countStmt = $this->conn->prepare("
            SELECT COUNT(*) FROM pacientes p
            JOIN usuarios u ON p.id_usuario = u.id_usuario
            {$where}
        ");
        $countStmt->execute($params);
        $total = (int) $countStmt->fetchColumn();

        // Registros de la página actual
        $params[':limit']  = $limit;
        $params[':offset'] = $offset;

        $stmt = $this->conn->prepare("
            SELECT p.*,
                   u.nombre_apellido,
                   u.email,
                   u.telefono,
                   u.usuario_usuario
            FROM pacientes p
            JOIN usuarios u ON p.id_usuario = u.id_usuario
            {$where}
            ORDER BY u.nombre_apellido ASC
            LIMIT :limit OFFSET :offset
        ");
        $stmt->bindValue(':limit',  $limit,  PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        if ($search !== '') {
            $stmt->bindValue(':search', "%{$search}%");
        }
        $stmt->execute();

        return [
            'data'  => array_map(fn($r) => PacienteDTO::fromArray($r), $stmt->fetchAll()),
            'total' => $total,
        ];
    }

    /**
     * Insertar nuevo paciente. Devuelve el id_paciente generado.
     */
    public function save(mixed $dto): int
    {
        /** @var PacienteDTO $dto */
        $stmt = $this->conn->prepare('
            INSERT INTO pacientes (
                id_usuario, fecha_nacimiento, genero,
                alergias, enfermedades_cronicas, medicamentos,
                seguro_medico, numero_seguro
            ) VALUES (
                :id_usuario, :fecha_nacimiento, :genero,
                :alergias, :enfermedades_cronicas, :medicamentos,
                :seguro_medico, :numero_seguro
            )
        ');

        $stmt->execute($dto->toArrayPaciente());
        return (int) $this->conn->lastInsertId();
    }

    /**
     * Actualizar datos médicos de un paciente.
     */
    public function update(PacienteDTO $dto): bool
    {
        $stmt = $this->conn->prepare('
            UPDATE pacientes SET
                fecha_nacimiento      = :fecha_nacimiento,
                genero                = :genero,
                alergias              = :alergias,
                enfermedades_cronicas = :enfermedades_cronicas,
                medicamentos          = :medicamentos,
                seguro_medico         = :seguro_medico,
                numero_seguro         = :numero_seguro
            WHERE id_paciente = :id
        ');

        return $stmt->execute([
            ':id'                   => $dto->id,
            ':fecha_nacimiento'     => $dto->fechaNacimiento,
            ':genero'               => $dto->genero,
            ':alergias'             => $dto->alergias,
            ':enfermedades_cronicas'=> $dto->enfermedadesCronicas,
            ':medicamentos'         => $dto->medicamentos,
            ':seguro_medico'        => $dto->seguroMedico,
            ':numero_seguro'        => $dto->numeroSeguro,
        ]);
    }

    /**
     * Eliminar un paciente por ID.
     */
    public function delete(int $id): bool
    {
        $stmt = $this->conn->prepare(
            'DELETE FROM pacientes WHERE id_paciente = :id'
        );
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount() > 0;
    }

    // ── Consultas específicas ──────────────────────────────────────────────

    /**
     * Buscar paciente por id_usuario (para el perfil del paciente logueado).
     */
    public function findByIdUsuario(int $idUsuario): ?PacienteDTO
    {
        $stmt = $this->conn->prepare('
            SELECT p.*,
                   u.nombre_apellido,
                   u.email,
                   u.telefono,
                   u.usuario_usuario
            FROM pacientes p
            JOIN usuarios u ON p.id_usuario = u.id_usuario
            WHERE p.id_usuario = :id_usuario
            LIMIT 1
        ');
        $stmt->execute([':id_usuario' => $idUsuario]);
        $row = $stmt->fetch();

        return $row ? PacienteDTO::fromArray($row) : null;
    }

    /**
     * Pacientes asociados a un dentista (tienen citas con él).
     *
     * @return PacienteDTO[]
     */
    public function findByDentista(int $idDentista, string $search = ''): array
    {
        $where  = $search !== '' ? 'AND (u.nombre_apellido LIKE :search OR u.email LIKE :search)' : '';
        $params = [':id_dentista' => $idDentista];
        if ($search !== '') {
            $params[':search'] = "%{$search}%";
        }

        $stmt = $this->conn->prepare("
            SELECT DISTINCT p.*,
                   u.nombre_apellido,
                   u.email,
                   u.telefono,
                   u.usuario_usuario
            FROM pacientes p
            JOIN usuarios u  ON p.id_usuario    = u.id_usuario
            JOIN citas c     ON c.id_paciente   = p.id_paciente
            JOIN dentistas d ON c.id_dentista   = d.id_dentista
            WHERE d.id_dentista = :id_dentista
            {$where}
            ORDER BY u.nombre_apellido ASC
        ");
        $stmt->execute($params);

        return array_map(fn($r) => PacienteDTO::fromArray($r), $stmt->fetchAll());
    }

    /**
     * Contar total de pacientes en el sistema.
     */
    public function contar(): int
    {
        $stmt = $this->conn->query("SELECT COUNT(*) FROM pacientes");
        return (int) $stmt->fetchColumn();
    }
}
