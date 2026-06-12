<?php

namespace App\Controllers;

use App\Factories\UsuarioFactory;
use App\Repositories\UsuarioDAO;
use App\Database\Database;

/**
 * UsuarioController — Controlador para la gestión de usuarios
 */
class UsuarioController
{
    private UsuarioDAO $usuarioDAO;
    private UsuarioFactory $usuarioFactory;

    public function __construct()
    {
        $this->usuarioDAO = new UsuarioDAO();
        $this->usuarioFactory = new UsuarioFactory();
    }

    /**
     * Acción: Listar todos los usuarios
     */
    public function listar(): array
    {
        $datosUsuarios = $this->usuarioDAO->listar();
        $usuarios = $this->usuarioFactory->crearMultiples($datosUsuarios);

        return array_map(fn($u) => $u->toArray(), $usuarios);
    }

    /**
     * Acción: Obtener un usuario por ID
     */
    public function obtenerPorId(int $idUsuario): ?array
    {
        $datos = $this->usuarioDAO->buscarPorId($idUsuario);
        if (!$datos) return null;
        return $this->usuarioFactory->crear($datos)->toArray();
    }

    /**
     * Acción: Registrar un nuevo usuario
     */
    public function registrar(array $datos): array
    {
        // Seguridad: Hashear contraseña antes del INSERT
        if (!empty($datos['usuario_clave'])) {
            $datos['usuario_clave'] = password_hash($datos['usuario_clave'], PASSWORD_DEFAULT);
        } else {
            throw new \InvalidArgumentException("La contraseña es obligatoria para nuevos usuarios", 400);
        }

        $id = $this->usuarioDAO->registrar($datos);

        // ── Auto-crear registro en tabla hija según el rol ────────────────
        $idRol = (int) ($datos['id_rol'] ?? 0);
        $conn = Database::getInstance()->getConnection();

        if ($idRol === 4) {
            // Rol Paciente - Guardar datos clínicos si existen
            $stmt = $conn->prepare('
                INSERT INTO pacientes (
                    id_usuario, fecha_nacimiento, genero, alergias, 
                    enfermedades_cronicas, seguro_medico, numero_seguro
                ) VALUES (
                    :id_usuario, :fecha_nacimiento, :genero, :alergias, 
                    :enfermedades_cronicas, :seguro_medico, :numero_seguro
                )
            ');
            $stmt->execute([
                ':id_usuario'            => $id,
                ':fecha_nacimiento'      => !empty($datos['fecha_nacimiento']) ? $datos['fecha_nacimiento'] : null,
                ':genero'                => !empty($datos['genero']) ? $datos['genero'] : null,
                ':alergias'              => !empty($datos['alergias']) ? $datos['alergias'] : null,
                ':enfermedades_cronicas' => !empty($datos['enfermedades_cronicas']) ? $datos['enfermedades_cronicas'] : null,
                ':seguro_medico'         => !empty($datos['seguro_medico']) ? $datos['seguro_medico'] : null,
                ':numero_seguro'         => !empty($datos['numero_seguro']) ? $datos['numero_seguro'] : null,
            ]);
        } elseif ($idRol === 2) {
            // Rol Dentista - Guardar datos profesionales si existen
            $stmt = $conn->prepare('
                INSERT INTO dentistas (
                    id_usuario, id_especialidad, cedula_profesional, 
                    biografia, experiencia, horario, foto
                ) VALUES (
                    :id_usuario, :id_especialidad, :cedula_profesional, 
                    :biografia, :experiencia, :horario, :foto
                )
            ');
            $stmt->execute([
                ':id_usuario'         => $id,
                ':id_especialidad'    => !empty($datos['id_especialidad']) ? $datos['id_especialidad'] : null,
                ':cedula_profesional' => !empty($datos['cedula_profesional']) ? $datos['cedula_profesional'] : null,
                ':biografia'          => !empty($datos['biografia']) ? $datos['biografia'] : null,
                ':experiencia'        => !empty($datos['experiencia']) ? $datos['experiencia'] : null,
                ':horario'            => !empty($datos['horario']) ? $datos['horario'] : null,
                ':foto'               => !empty($datos['foto']) ? $datos['foto'] : null,
            ]);
        }

        $usuarioData = $this->usuarioDAO->buscarPorId($id);
        $usuario = $this->usuarioFactory->crear($usuarioData);

        return [
            'success' => true,
            'id' => $id,
            'usuario' => $usuario->toArray(),
        ];
    }

    /**
     * Acción: Actualizar un usuario existente
     */
    public function actualizar(int $id, array $datos): array
    {
        // Seguridad: Hashear contraseña si se proporcionó una nueva
        if (!empty($datos['usuario_clave'])) {
            $datos['usuario_clave'] = password_hash($datos['usuario_clave'], PASSWORD_DEFAULT);
        }

        $success = $this->usuarioDAO->update($id, $datos);

        // ── Auto-actualizar registro en tabla hija si es Paciente ────────────────
        $idRol = (int) ($datos['id_rol'] ?? 0);
        if ($idRol === 4) {
            $conn = Database::getInstance()->getConnection();
            $stmt = $conn->prepare('
                UPDATE pacientes SET 
                    fecha_nacimiento = :fecha_nacimiento,
                    genero = :genero,
                    alergias = :alergias,
                    enfermedades_cronicas = :enfermedades_cronicas,
                    seguro_medico = :seguro_medico,
                    numero_seguro = :numero_seguro
                WHERE id_usuario = :id_usuario
            ');
            $stmt->execute([
                ':id_usuario'            => $id,
                ':fecha_nacimiento'      => !empty($datos['fecha_nacimiento']) ? $datos['fecha_nacimiento'] : null,
                ':genero'                => !empty($datos['genero']) ? $datos['genero'] : null,
                ':alergias'              => !empty($datos['alergias']) ? $datos['alergias'] : null,
                ':enfermedades_cronicas' => !empty($datos['enfermedades_cronicas']) ? $datos['enfermedades_cronicas'] : null,
                ':seguro_medico'         => !empty($datos['seguro_medico']) ? $datos['seguro_medico'] : null,
                ':numero_seguro'         => !empty($datos['numero_seguro']) ? $datos['numero_seguro'] : null,
            ]);
        } elseif ($idRol === 2) {
            $conn = Database::getInstance()->getConnection();
            $stmt = $conn->prepare('
                UPDATE dentistas SET 
                    id_especialidad = :id_especialidad,
                    cedula_profesional = :cedula_profesional,
                    biografia = :biografia,
                    experiencia = :experiencia,
                    horario = :horario,
                    foto = :foto
                WHERE id_usuario = :id_usuario
            ');
            $stmt->execute([
                ':id_usuario'         => $id,
                ':id_especialidad'    => !empty($datos['id_especialidad']) ? $datos['id_especialidad'] : null,
                ':cedula_profesional' => !empty($datos['cedula_profesional']) ? $datos['cedula_profesional'] : null,
                ':biografia'          => !empty($datos['biografia']) ? $datos['biografia'] : null,
                ':experiencia'        => !empty($datos['experiencia']) ? $datos['experiencia'] : null,
                ':horario'            => !empty($datos['horario']) ? $datos['horario'] : null,
                ':foto'               => !empty($datos['foto']) ? $datos['foto'] : null,
            ]);
        }

        $usuarioData = $this->usuarioDAO->buscarPorId($id);
        $usuario = $this->usuarioFactory->crear($usuarioData);

        return [
            'success' => $success,
            'usuario' => $usuario->toArray(),
        ];
    }

    /**
     * Acción: Eliminar un usuario
     */
    public function eliminar(int $idUsuario): bool
    {
        return $this->usuarioDAO->delete($idUsuario);
    }
}
