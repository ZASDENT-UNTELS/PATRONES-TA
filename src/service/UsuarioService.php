<?php

require_once __DIR__ . '/../database/conexion.php';
require_once __DIR__ . '/../../models/UsuarioDAO.php';

class UsuarioService
{
    private UsuarioDAO $usuarioDAO;
    private PDO $conn;

    public function __construct()
    {
        $this->usuarioDAO = new UsuarioDAO();
        $this->conn = Database::getInstance()->getConnection();
    }

    public function registrar(array $data): array
    {
        $required = ['nombre_apellido', 'usuario_usuario', 'password', 'email', 'id_rol'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                throw new InvalidArgumentException("Campo requerido: {$field}", 400);
            }
        }

        $data['email'] = trim($data['email']);
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException('Email inválido.', 400);
        }

        $data['usuario_usuario'] = trim($data['usuario_usuario']);
        if ($data['usuario_usuario'] === '') {
            throw new InvalidArgumentException('El usuario es requerido.', 400);
        }

        $password = $data['password'];
        if (strlen($password) < 6) {
            throw new InvalidArgumentException('La contraseña debe tener al menos 6 caracteres.', 400);
        }

        $stmt = $this->conn->prepare('SELECT usuario_usuario, email FROM usuarios WHERE usuario_usuario = :usuario OR email = :email LIMIT 1');
        $stmt->execute([
            ':usuario' => $data['usuario_usuario'],
            ':email' => $data['email'],
        ]);
        $existing = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($existing) {
            if ($existing['usuario_usuario'] === $data['usuario_usuario']) {
                throw new RuntimeException('El nombre de usuario ya existe.', 409);
            }
            if ($existing['email'] === $data['email']) {
                throw new RuntimeException('El email ya está registrado.', 409);
            }
        }

        $insertData = [
            'nombre_apellido' => $data['nombre_apellido'],
            'usuario_usuario' => $data['usuario_usuario'],
            'usuario_clave' => password_hash($password, PASSWORD_DEFAULT),
            'email' => $data['email'],
            'telefono' => $data['telefono'] ?? null,
            'id_rol' => (int) $data['id_rol'],
            'activo' => $data['activo'] ?? 1,
        ];

        $id = $this->usuarioDAO->registrar($insertData);

        return [
            'success' => true,
            'id' => $id,
            'message' => 'Usuario registrado correctamente.',
        ];
    }

    public function actualizar(int $id, array $data): array
    {
        $required = ['nombre_apellido', 'usuario_usuario', 'email', 'id_rol'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                throw new InvalidArgumentException("Campo requerido: {$field}", 400);
            }
        }

        $data['email'] = trim($data['email']);
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException('Email inválido.', 400);
        }

        $data['usuario_usuario'] = trim($data['usuario_usuario']);

        // Check for duplicates excluding self
        $stmt = $this->conn->prepare(
            'SELECT id_usuario, usuario_usuario, email FROM usuarios 
             WHERE (usuario_usuario = :usuario OR email = :email) AND id_usuario != :id LIMIT 1'
        );
        $stmt->execute([
            ':usuario' => $data['usuario_usuario'],
            ':email' => $data['email'],
            ':id' => $id,
        ]);
        $existing = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($existing) {
            if ($existing['usuario_usuario'] === $data['usuario_usuario']) {
                throw new RuntimeException('El nombre de usuario ya existe.', 409);
            }
            if ($existing['email'] === $data['email']) {
                throw new RuntimeException('El email ya está registrado.', 409);
            }
        }

        $updateData = [
            'nombre_apellido' => $data['nombre_apellido'],
            'usuario_usuario' => $data['usuario_usuario'],
            'email' => $data['email'],
            'telefono' => $data['telefono'] ?? null,
            'id_rol' => (int) $data['id_rol'],
            'activo' => isset($data['activo']) ? (int) $data['activo'] : 1,
        ];

        // Only update password if provided
        if (!empty($data['password'])) {
            if (strlen($data['password']) < 6) {
                throw new InvalidArgumentException('La contraseña debe tener al menos 6 caracteres.', 400);
            }
            $updateData['usuario_clave'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }

        $this->usuarioDAO->update($id, $updateData);

        return [
            'success' => true,
            'message' => 'Usuario actualizado correctamente.',
        ];
    }
}
