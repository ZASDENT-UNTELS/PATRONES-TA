<?php

require_once __DIR__ . '/../src/dao/DAOInterface.php';
require_once __DIR__ . '/../src/database/conexion.php';

/**
 * UsuarioDAO — Data Access Object para la tabla usuarios
 */
class UsuarioDAO implements DAOInterface
{
    private PDO $conn;

    public function __construct()
    {
        $this->conn = Database::getInstance()->getConnection();
    }

    // ── Métodos de DAOInterface ──────────────────────────────────────────

    public function findById(int $id): ?array
    {
        $stmt = $this->conn->prepare('
            SELECT u.*, r.nombre AS nombre_rol 
            FROM usuarios u
            LEFT JOIN roles r ON u.id_rol = r.id_rol
            WHERE u.id_usuario = :id LIMIT 1
        ');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
    }

    public function findAll(): array
    {
        $stmt = $this->conn->query('SELECT u.*, r.nombre AS nombre_rol
                                     FROM usuarios u
                                     LEFT JOIN roles r ON u.id_rol = r.id_rol
                                     ORDER BY u.nombre_apellido ASC');
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function registrar(array $data): int
    {
        $stmt = $this->conn->prepare('INSERT INTO usuarios (nombre_apellido, usuario_usuario, usuario_clave, email, telefono, id_rol, activo)
                                       VALUES (:nombre_apellido, :usuario_usuario, :usuario_clave, :email, :telefono, :id_rol, :activo)');
        $stmt->execute([
            ':nombre_apellido' => $data['nombre_apellido'] ?? null,
            ':usuario_usuario' => $data['usuario_usuario'] ?? null,
            ':usuario_clave' => $data['usuario_clave'] ?? null,
            ':email' => $data['email'] ?? null,
            ':telefono' => $data['telefono'] ?? null,
            ':id_rol' => $data['id_rol'] ?? 2,
            ':activo' => $data['activo'] ?? 1,
        ]);
        return (int) $this->conn->lastInsertId();
    }

    public function listar(): array
    {
        return $this->findAll();
    }

    public function buscarPorId(int $id): ?array
    {
        return $this->findById($id);
    }

    public function save(mixed $dto): int
    {
        throw new LogicException('Método save() no implementado en UsuarioDAO.');
    }

    public function delete(int $id): bool
    {
        $stmt = $this->conn->prepare('DELETE FROM usuarios WHERE id_usuario = :id');
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount() > 0;
    }

    public function update(int $id, array $data): bool
    {
        $fields = [];
        $params = [':id' => $id];

        if (isset($data['nombre_apellido'])) {
            $fields[] = 'nombre_apellido = :nombre_apellido';
            $params[':nombre_apellido'] = $data['nombre_apellido'];
        }
        if (isset($data['usuario_usuario'])) {
            $fields[] = 'usuario_usuario = :usuario_usuario';
            $params[':usuario_usuario'] = $data['usuario_usuario'];
        }
        if (isset($data['email'])) {
            $fields[] = 'email = :email';
            $params[':email'] = $data['email'];
        }
        if (isset($data['telefono'])) {
            $fields[] = 'telefono = :telefono';
            $params[':telefono'] = $data['telefono'];
        }
        if (isset($data['id_rol'])) {
            $fields[] = 'id_rol = :id_rol';
            $params[':id_rol'] = (int) $data['id_rol'];
        }
        if (isset($data['activo'])) {
            $fields[] = 'activo = :activo';
            $params[':activo'] = (int) $data['activo'];
        }
        if (!empty($data['usuario_clave'])) {
            $fields[] = 'usuario_clave = :usuario_clave';
            $params[':usuario_clave'] = $data['usuario_clave'];
        }

        if (empty($fields)) {
            return false;
        }

        $sql = 'UPDATE usuarios SET ' . implode(', ', $fields) . ' WHERE id_usuario = :id';
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        return $stmt->rowCount() > 0;
    }

    // ── Métodos Específicos ─────────────────────────────────────────────

    /**
     * Buscar un usuario por email o nombre de usuario (para login).
     */
    public function findByUsernameOrEmail(string $username): ?array
    {
        $stmt = $this->conn->prepare('
            SELECT u.id_usuario, u.nombre_apellido, u.usuario_clave,
                   u.usuario_usuario, u.email, u.activo,
                   r.nombre AS nombre_rol, r.id_rol
            FROM usuarios u
            JOIN roles r ON u.id_rol = r.id_rol
            WHERE (u.email = :username1 OR u.usuario_usuario = :username2)
              AND u.activo = 1
            LIMIT 1
        ');
        $stmt->execute([
            ':username1' => $username,
            ':username2' => $username
        ]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
    }

    /**
     * Actualiza la fecha y hora del último acceso.
     */
    public function updateUltimoLogin(int $idUsuario): void
    {
        $this->conn->prepare('UPDATE usuarios SET ultimo_login = NOW() WHERE id_usuario = :id')
                   ->execute([':id' => $idUsuario]);
    }

    /**
     * Actualizar los datos de perfil básicos de un usuario.
     */
    public function updatePerfil(int $idUsuario, string $nombre, string $email, ?string $telefono, ?string $direccion): void
    {
        $stmt = $this->conn->prepare('
            UPDATE usuarios 
            SET nombre_apellido = :nombre, email = :email, telefono = :telefono, direccion = :direccion
            WHERE id_usuario = :id_usuario
        ');
        $stmt->execute([
            ':nombre' => $nombre,
            ':email' => $email,
            ':telefono' => $telefono,
            ':direccion' => $direccion,
            ':id_usuario' => $idUsuario
        ]);
    }

    /**
     * Obtener el perfil completo del usuario, incluyendo datos de paciente si existe.
     */
    public function getPerfilCompleto(int $idUsuario): ?array
    {
        $stmt = $this->conn->prepare('
            SELECT u.nombre_apellido, u.email, u.usuario_usuario, u.telefono, u.direccion,
                   p.id_paciente, p.fecha_nacimiento, p.genero, p.alergias, 
                   p.enfermedades_cronicas, p.medicamentos, p.seguro_medico, p.numero_seguro
            FROM usuarios u
            LEFT JOIN pacientes p ON u.id_usuario = p.id_usuario
            WHERE u.id_usuario = :id_usuario
            LIMIT 1
        ');
        $stmt->execute([':id_usuario' => $idUsuario]);
        $perfil = $stmt->fetch(PDO::FETCH_ASSOC);
        return $perfil ?: null;
    }
}
