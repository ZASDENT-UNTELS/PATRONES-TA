<?php

require_once __DIR__ . '/../dao/UsuarioDAO.php';

/**
 * AuthService — Service Layer para autenticación
 *
 * Centraliza toda la lógica de login, sesión y control de acceso por rol.
 * Detectado en el código original: login.php mezclaba HTML + SQL + sesión.
 */
class AuthService
{
    private UsuarioDAO $usuarioDAO;

    // Roles del sistema (deben coincidir con la tabla `roles` en BD)
    public const ROL_ADMIN      = 1;
    public const ROL_DENTISTA   = 2;
    public const ROL_RECEPCION  = 3;
    public const ROL_PACIENTE   = 4;

    // Rutas de redirección por rol (para el Front Controller)
    private const RUTAS_ROL = [
        self::ROL_ADMIN     => '/admin/dashboard',
        self::ROL_DENTISTA  => '/dentista/dashboard',
        self::ROL_RECEPCION => '/recepcion/dashboard',
        self::ROL_PACIENTE  => '/paciente/dashboard',
    ];

    public function __construct()
    {
        $this->usuarioDAO = new UsuarioDAO();
    }

    /**
     * Autenticar un usuario y crear la sesión.
     *
     * @throws InvalidArgumentException si los campos están vacíos
     * @throws RuntimeException si las credenciales son incorrectas
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
        session_regenerate_id(true); // prevenir session fixation

        $_SESSION['id_usuario'] = $usuario['id_usuario'];
        $_SESSION['nombre']     = $usuario['nombre_apellido'];
        $_SESSION['rol']        = $usuario['nombre_rol'];
        $_SESSION['id_rol']     = $usuario['id_rol'];
        $_SESSION['username']   = $usuario['usuario_usuario'];

        return [
            'success'      => true,
            'redirect'     => self::RUTAS_ROL[$usuario['id_rol']] ?? '/dashboard',
            'nombre'       => $usuario['nombre_apellido'],
            'rol'          => $usuario['nombre_rol'],
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
     *
     * Uso en el Front Controller:
     *   AuthService::verificarRol([AuthService::ROL_ADMIN, AuthService::ROL_RECEPCION]);
     *
     * @throws RuntimeException si no tiene permiso (403)
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
        ];
    }
}
