<?php

namespace App\Services;

use App\Repositories\UsuarioDAO;
use Exception;
use InvalidArgumentException;
use RuntimeException;

/**
 * AuthService — Service Layer para autenticación
 *
 * Centraliza toda la lógica de login, sesión y control de acceso por rol.
 */
class AuthService
{
    private UsuarioDAO $usuarioDAO;

    // Roles del sistema
    public const ROL_ADMIN      = 1;
    public const ROL_DENTISTA   = 2;
    public const ROL_RECEPCION  = 3;
    public const ROL_PACIENTE   = 4;

    // Rutas de redirección por rol
    private const RUTAS_ROL = [
        self::ROL_ADMIN     => '/app/dashboard',
        self::ROL_DENTISTA  => '/app/dentist-schedule',
        self::ROL_RECEPCION => '/app/appointments',
        self::ROL_PACIENTE  => '/app/my-appointments',
    ];

    public function __construct()
    {
        $this->usuarioDAO = new UsuarioDAO();
    }

    /**
     * Autenticar un usuario y crear la sesión.
     */
    public function login(string $username, string $password): array
    {
        if (empty($username) || empty($password)) {
            throw new InvalidArgumentException('Usuario y contraseña son requeridos.', 400);
        }

        $usuario = $this->usuarioDAO->findByUsernameOrEmail($username);

        if (!$usuario || !password_verify($password, $usuario['usuario_clave'])) {
            throw new RuntimeException('Credenciales incorrectas.', 401);
        }

        // Actualizar último login
        $this->usuarioDAO->updateUltimoLogin($usuario['id_usuario']);

        // Crear sesión
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        session_regenerate_id(true);

        // Usar Factory Method para crear el objeto Usuario correcto y obtener sus capacidades
        $instanciaUsuario = \App\Factories\UsuarioFactory::crear($usuario);
        $permisos = $instanciaUsuario->getPermisos();
        $icono = $instanciaUsuario->getIcono();
        $descripcion = $instanciaUsuario->getDescripcion();

        $_SESSION['id_usuario'] = $usuario['id_usuario'];
        $_SESSION['nombre']     = $usuario['nombre_apellido'];
        $_SESSION['rol']        = $usuario['nombre_rol'];
        $_SESSION['id_rol']     = $usuario['id_rol'];
        $_SESSION['username']   = $usuario['usuario_usuario'];
        $_SESSION['permisos']   = $permisos;

        return [
            'success'      => true,
            'id_usuario'   => $usuario['id_usuario'],
            'id_rol'       => $usuario['id_rol'],
            'nombre'       => $usuario['nombre_apellido'],
            'rol'          => $usuario['nombre_rol'],
            'username'     => $usuario['usuario_usuario'],
            'icono'        => $icono,
            'descripcion'  => $descripcion,
            'permisos'     => $permisos,
            'redirect'     => self::RUTAS_ROL[$usuario['id_rol']] ?? '/dashboard',
        ];
    }

    /**
     * Cerrar sesión.
     */
    public function logout(): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        $_SESSION = [];
        session_destroy();
    }

    /**
     * Verificar si hay una sesión activa.
     */
    public function estaAutenticado(): bool
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        return isset($_SESSION['id_usuario']);
    }

    /**
     * Verificar si el usuario tiene uno de los roles permitidos.
     */
    public function verificarRol(array $rolesPermitidos): void
    {
        if (!$this->estaAutenticado()) {
            throw new RuntimeException('No autenticado.', 401);
        }
        if (!in_array($_SESSION['id_rol'], $rolesPermitidos, true)) {
            throw new RuntimeException('Acceso no autorizado.', 403);
        }
    }

    /**
     * Obtener datos del usuario en sesión.
     */
    public function usuarioActual(): array
    {
        return [
            'id_usuario' => $_SESSION['id_usuario'] ?? null,
            'nombre'     => $_SESSION['nombre']     ?? null,
            'rol'        => $_SESSION['rol']        ?? null,
            'id_rol'     => $_SESSION['id_rol']     ?? null,
            'username'   => $_SESSION['username']   ?? null,
            'permisos'   => $_SESSION['permisos']   ?? [],
        ];
    }
}
