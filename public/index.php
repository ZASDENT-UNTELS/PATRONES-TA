<?php

/**
 * Front Controller — public/index.php
 *
 * ÚNICO punto de entrada de toda la aplicación.
 * Todas las peticiones HTTP pasan por aquí.
 *
 * Antes (sin Front Controller):
 *   /modulo/dentista/agenda/crear_cita/registrar_cita.php  ← endpoint directo
 *   /modulo/recepcion/pagos/crear_pago/registrar_pago.php  ← endpoint directo
 *   /bienvenido/login.php                                  ← endpoint directo
 *   → 83 archivos PHP eran 83 endpoints diferentes
 *
 * Ahora (con Front Controller):
 *   /index.php → enruta según METHOD + PATH → llama al handler correcto
 *   → Un solo punto de entrada, un solo lugar para CORS, auth, errores
 *
 * Configuración en Apache (.htaccess):
 *   RewriteEngine On
 *   RewriteCond %{REQUEST_FILENAME} !-f
 *   RewriteRule ^(.*)$ index.php [QSA,L]
 */

declare(strict_types=1);

// ── Configuración inicial ──────────────────────────────────────────────────

define('ROOT_PATH', dirname(__DIR__));

require_once ROOT_PATH . '/vendor/autoload.php';

// ── Headers globales ───────────────────────────────────────────────────────

header('Content-Type: application/json; charset=utf-8');

// CORS: permitir peticiones desde el frontend Angular
$allowedOrigins = ['http://localhost:4200', 'https://zazdent.com'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: {$origin}");
}
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Preflight OPTIONS (Angular lo envía antes de cada petición real)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// ── Router ─────────────────────────────────────────────────────────────────

$method = $_SERVER['REQUEST_METHOD'];
$path   = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Extraer la ruta base (ej: /zazdent/public) y eliminarla del path
$basePath = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME']));
if ($basePath !== '/' && strpos($path, $basePath) === 0) {
    $path = substr($path, strlen($basePath));
}

$path   = rtrim($path, '/') ?: '/';

// Leer body JSON una sola vez
$body = [];
$raw  = file_get_contents('php://input');
if (!empty($raw)) {
    $body = json_decode($raw, true) ?? [];
}

try {
    // Requerir dependencias dentro del try para capturar excepciones (ej. fallo de DB)
    require_once ROOT_PATH . '/src/database/conexion.php';
    require_once ROOT_PATH . '/src/service/AuthService.php';
    require_once ROOT_PATH . '/src/service/CitaService.php';
    require_once ROOT_PATH . '/src/service/PagoService.php';

    // ── Rutas públicas (sin autenticación) ────────────────────────────────

    if ($method === 'POST' && $path === '/api/auth/login') {
        $service = new AuthService();
        $result  = $service->login(
            $body['username'] ?? '',
            $body['password'] ?? ''
        );
        respond(200, $result);
    }

    if ($method === 'POST' && $path === '/api/auth/logout') {
        (new AuthService())->logout();
        respond(200, ['success' => true, 'message' => 'Sesión cerrada.']);
    }

    if ($method === 'GET' && $path === '/api/auth/me') {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        if (isset($_SESSION['id_usuario'])) {
            respond(200, [
                'id_usuario' => $_SESSION['id_usuario'],
                'nombre' => $_SESSION['nombre'],
                'rol' => $_SESSION['rol'],
                'id_rol' => $_SESSION['id_rol'],
                'username' => $_SESSION['username']
            ]);
        } else {
            respond(401, ['error' => 'No autenticado.']);
        }
    }

    // ── Middleware de autenticación ────────────────────────────────────────
    // Todas las rutas debajo de aquí requieren sesión activa

    $auth = new AuthService();
    if (!$auth->estaAutenticado()) {
        respond(401, ['error' => 'No autenticado.']);
    }

    // ── Ruta Dashboard ────────────────────────────────────────────────────

    if ($method === 'GET' && $path === '/api/dashboard') {
        require_once ROOT_PATH . '/src/dao/CitaDAO.php';
        require_once ROOT_PATH . '/src/dao/PacienteDAO.php';
        require_once ROOT_PATH . '/src/dao/DentistaDAO.php';
        require_once ROOT_PATH . '/src/dao/PagoDAO.php';

        $citaDAO = new CitaDAO();
        $pacienteDAO = new PacienteDAO();
        $dentistaDAO = new DentistaDAO();
        $pagoDAO = new PagoDAO();

        $stats = [
            'citasHoy' => $citaDAO->contarPorFecha(date('Y-m-d')),
            'totalPacientes' => $pacienteDAO->contar(),
            'totalDentistas' => $dentistaDAO->contar(),
            'ingresosEsteMes' => $pagoDAO->totalPorMes(date('Y-m')),
        ];

        respond(200, $stats);
    }

    // ── Rutas de Citas ────────────────────────────────────────────────────

    if ($path === '/api/citas') {
        $auth->verificarRol([AuthService::ROL_ADMIN, AuthService::ROL_DENTISTA, AuthService::ROL_RECEPCION]);
        $service = new CitaService();

        match ($method) {
            'GET'  => respond(200, $service->listarPorDentista(
                           (int) ($_GET['id_dentista'] ?? 0),
                           $_GET['fecha'] ?? null
                       )),
            'POST' => respond(201, $service->crear($body)),
            default => respond(405, ['error' => 'Método no permitido.']),
        };
    }

    if (preg_match('#^/api/citas/(\d+)$#', $path, $m)) {
        $auth->verificarRol([AuthService::ROL_ADMIN, AuthService::ROL_DENTISTA, AuthService::ROL_RECEPCION]);
        $service = new CitaService();
        $id      = (int) $m[1];

        match ($method) {
            'PUT'    => respond(200, $service->cambiarEstado($id, $body['estado'] ?? '')),
            'DELETE' => respond(200, $service->eliminar($id)),
            default  => respond(405, ['error' => 'Método no permitido.']),
        };
    }

    if ($path === '/api/citas/hoy') {
        $auth->verificarRol([AuthService::ROL_ADMIN, AuthService::ROL_DENTISTA, AuthService::ROL_RECEPCION]);
        respond(200, ['total' => (new CitaService())->totalHoy()]);
    }

    // ── Rutas de Pagos ────────────────────────────────────────────────────

    if ($path === '/api/pagos') {
        $auth->verificarRol([AuthService::ROL_ADMIN, AuthService::ROL_RECEPCION]);
        $service = new PagoService();

        match ($method) {
            'GET'  => respond(200, (new PagoDAO())->findAll()),
            'POST' => respond(201, $service->registrar($body)),
            default => respond(405, ['error' => 'Método no permitido.']),
        };
    }

    if (preg_match('#^/api/pagos/(\d+)/anular$#', $path, $m)) {
        $auth->verificarRol([AuthService::ROL_ADMIN, AuthService::ROL_RECEPCION]);
        respond(200, (new PagoService())->anular((int) $m[1]));
    }

    if ($path === '/api/pagos/reporte') {
        $auth->verificarRol([AuthService::ROL_ADMIN]);
        $total = (new PagoService())->totalRecaudado(
            $_GET['desde'] ?? date('Y-m-01'),
            $_GET['hasta'] ?? date('Y-m-t')
        );
        respond(200, ['total' => $total]);
    }

    // ── Rutas de Paciente ──────────────────────────────────────────────────

    if ($path === '/api/paciente/perfil') {
        $auth->verificarRol([AuthService::ROL_PACIENTE]);
        require_once ROOT_PATH . '/src/service/PacienteService.php';
        $service = new PacienteService();
        $idUsuario = $_SESSION['id_usuario'];

        match ($method) {
            'GET'  => respond(200, $service->obtenerPerfil($idUsuario)),
            'PUT'  => respond(200, $service->actualizarPerfil($idUsuario, $body)),
            default => respond(405, ['error' => 'Método no permitido.']),
        };
    }

    if ($path === '/api/paciente/citas') {
        $auth->verificarRol([AuthService::ROL_PACIENTE]);
        require_once ROOT_PATH . '/src/service/PacienteService.php';
        $idUsuario = $_SESSION['id_usuario'];
        $idPaciente = (new PacienteService())->obtenerIdPaciente($idUsuario);

        if (!$idPaciente) {
            respond(200, []); // Si no tiene id_paciente, no tiene citas
        }

        match ($method) {
            'GET'  => respond(200, (new CitaService())->listarPorPaciente($idPaciente)),
            default => respond(405, ['error' => 'Método no permitido.']),
        };
    }

    if ($path === '/api/paciente/historial') {
        $auth->verificarRol([AuthService::ROL_PACIENTE]);
        require_once ROOT_PATH . '/src/service/PacienteService.php';
        $idUsuario = $_SESSION['id_usuario'];

        match ($method) {
            'GET'  => respond(200, (new PacienteService())->obtenerHistorial($idUsuario)),
            default => respond(405, ['error' => 'Método no permitido.']),
        };
    }

    if ($path === '/api/paciente/pagos') {
        $auth->verificarRol([AuthService::ROL_PACIENTE]);
        require_once ROOT_PATH . '/src/service/PacienteService.php';
        $idUsuario = $_SESSION['id_usuario'];
        $idPaciente = (new PacienteService())->obtenerIdPaciente($idUsuario);

        if (!$idPaciente) {
            respond(200, []);
        }

        match ($method) {
            'GET'  => respond(200, (new PagoService())->listarPorPaciente($idPaciente)),
            default => respond(405, ['error' => 'Método no permitido.']),
        };
    }

    // ── Nuevas Rutas Funcionales (Usuarios, Dentistas, Pacientes) ─────────

    if ($path === '/api/usuarios') {
        $auth->verificarRol([AuthService::ROL_ADMIN]);
        require_once ROOT_PATH . '/src/dao/UsuarioDAO.php';
        respond(200, (new UsuarioDAO())->findAll());
    }

    if ($path === '/api/dentistas') {
        $auth->verificarRol([AuthService::ROL_ADMIN, AuthService::ROL_RECEPCION]);
        require_once ROOT_PATH . '/src/dao/DentistaDAO.php';
        respond(200, (new DentistaDAO())->findAll());
    }

    if ($path === '/api/pacientes') {
        $auth->verificarRol([AuthService::ROL_ADMIN, AuthService::ROL_RECEPCION]);
        require_once ROOT_PATH . '/src/dao/PacienteDAO.php';
        // PacienteDAO->findAll devuelve un array con 'data' y 'total'
        $pacientes = (new PacienteDAO())->findAll(1000); 
        respond(200, $pacientes['data']);
    }

    // ── 404 — ruta no encontrada ──────────────────────────────────────────
    respond(404, ['error' => "Ruta no encontrada: {$method} {$path}"]);

} catch (InvalidArgumentException $e) {
    $code = is_numeric($e->getCode()) && $e->getCode() > 0 ? (int) $e->getCode() : 400;
    respond($code, ['error' => $e->getMessage()]);
} catch (RuntimeException $e) {
    $code = is_numeric($e->getCode()) && $e->getCode() > 0 ? (int) $e->getCode() : 500;
    respond($code, ['error' => $e->getMessage()]);
} catch (Throwable $e) {
    error_log('Error inesperado: ' . $e->getMessage());
    respond(500, ['error' => 'Error interno del servidor.']);
}

// ── Helper ─────────────────────────────────────────────────────────────────

/**
 * Enviar respuesta JSON y terminar la ejecución.
 */
function respond(int $status, mixed $data): never
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit();
}
