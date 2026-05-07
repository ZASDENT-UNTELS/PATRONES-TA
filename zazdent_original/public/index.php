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
require_once ROOT_PATH . '/php/database/conexion.php';
require_once ROOT_PATH . '/php/service/AuthService.php';
require_once ROOT_PATH . '/php/service/CitaService.php';
require_once ROOT_PATH . '/php/service/PagoService.php';

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
$path   = rtrim($path, '/') ?: '/';

// Leer body JSON una sola vez
$body = [];
$raw  = file_get_contents('php://input');
if (!empty($raw)) {
    $body = json_decode($raw, true) ?? [];
}

try {
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

    // ── Middleware de autenticación ────────────────────────────────────────
    // Todas las rutas debajo de aquí requieren sesión activa

    $auth = new AuthService();
    if (!$auth->estaAutenticado()) {
        respond(401, ['error' => 'No autenticado.']);
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

    // ── 404 — ruta no encontrada ──────────────────────────────────────────
    respond(404, ['error' => "Ruta no encontrada: {$method} {$path}"]);

} catch (InvalidArgumentException $e) {
    respond($e->getCode() ?: 400, ['error' => $e->getMessage()]);
} catch (RuntimeException $e) {
    respond($e->getCode() ?: 500, ['error' => $e->getMessage()]);
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
