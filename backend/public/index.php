<?php

/**
 * Front Controller — ZAZDENT API
 */

define('ROOT_PATH', dirname(__DIR__));

require_once ROOT_PATH . '/vendor/autoload.php';

// Deshabilitar salida de errores en HTML para no romper las respuestas JSON
ini_set('display_errors', '0');
ini_set('log_errors', '1');

// Iniciar sesión temprano para evitar warnings de "headers already sent"
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

use App\Controllers\AuthController;
use App\Controllers\UsuarioController;
use App\Controllers\DashboardController;
use App\Controllers\CitaController;
use App\Controllers\PagoController;

// CORS
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = ['http://localhost:4200', 'http://127.0.0.1:4200'];
if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header('Access-Control-Allow-Origin: http://localhost:4200');
}
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function respond($code, $data) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'] ?? '/';
$path = parse_url($uri, PHP_URL_PATH) ?? '/';

$basePaths = [
    '/PATRONES-TA/backend/public',
    '/PATRONES-TA-master/backend/public',
    '/backend/public',
];

foreach ($basePaths as $basePath) {
    if (strpos($path, $basePath) === 0) {
        $path = substr($path, strlen($basePath));
        break;
    }
}

$path = '/' . ltrim($path, '/');
$input = [];
$rawInput = file_get_contents('php://input');

if (is_string($rawInput) && trim($rawInput) !== '') {
    $decoded = json_decode($rawInput, true);
    if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
        $input = $decoded;
    } else {
        parse_str($rawInput, $parsedInput);
        if (is_array($parsedInput) && !empty($parsedInput)) {
            $input = $parsedInput;
        }
    }
}

if (empty($input) && !empty($_POST)) {
    $input = $_POST;
}

error_log('DEBUG_LOGIN method=' . $method . ' content_type=' . ($_SERVER['CONTENT_TYPE'] ?? '') . ' raw=' . json_encode($rawInput) . ' parsed=' . json_encode($input) . ' json_error=' . json_last_error_msg());

try {
    // --- AUTH ---
    $authController = new AuthController();
    if ($method === 'POST' && $path === '/api/auth/login') respond(200, $authController->login($input));
    if ($method === 'GET' && $path === '/api/auth/me') respond(200, $authController->me());
    if ($method === 'POST' && $path === '/api/auth/logout') respond(200, $authController->logout());

    // REQUIRE AUTH FOR ALL FOLLOWING ROUTES
    \App\Middleware\AuthMiddleware::requireAuth();

    // --- DASHBOARD ---
    if ($method === 'GET' && $path === '/api/dashboard') {
        \App\Middleware\AuthMiddleware::requireRole([1, 2, 3]); // Admin, Dentista, Recepcion
        $dashboardController = new DashboardController();
        respond(200, $dashboardController->getStats());
    }

    // --- USUARIOS ---
    if (strpos($path, '/api/users') === 0) {
        \App\Middleware\AuthMiddleware::requireRole([1]); // Solo Admin
        $usuarioController = new UsuarioController();
        if ($method === 'GET' && $path === '/api/users') respond(200, $usuarioController->listar());
        if ($method === 'POST' && $path === '/api/users') respond(201, $usuarioController->registrar($input));
        if ($method === 'PUT' && preg_match('#^/api/users/(\d+)$#', $path, $matches)) respond(200, $usuarioController->actualizar((int)$matches[1], $input));
        if ($method === 'DELETE' && preg_match('#^/api/users/(\d+)$#', $path, $matches)) respond(200, ['success' => $usuarioController->eliminar((int)$matches[1])]);
    }

    // --- CITAS ---
    if (strpos($path, '/api/appointments') === 0) {
        // Acceso permitido a todos los roles, el controlador filtrará los datos
        $citaController = new CitaController();
        if ($method === 'GET' && $path === '/api/appointments') respond(200, $citaController->listar());
        
        if ($method === 'POST' && $path === '/api/appointments') {
            respond(201, $citaController->registrar($input));
        }
        
        if ($method === 'PUT' && preg_match('#^/api/appointments/(\d+)/status$#', $path, $matches)) {
            \App\Middleware\AuthMiddleware::requireRole([1, 2, 3]); // Pacientes no pueden cambiar estado
            respond(200, $citaController->cambiarEstado((int)$matches[1], $input['estado'] ?? ''));
        }
        
        if ($method === 'DELETE' && preg_match('#^/api/appointments/(\d+)$#', $path, $matches)) {
            \App\Middleware\AuthMiddleware::requireRole([1, 3]); // Solo admin/recepción eliminan
            respond(200, $citaController->eliminar((int)$matches[1]));
        }
    }

    // --- PAGOS ---
    if (strpos($path, '/api/payments') === 0) {
        $pagoController = new PagoController();
        if ($method === 'GET' && $path === '/api/payments') respond(200, $pagoController->listar());
        
        if ($method === 'POST' && $path === '/api/payments') {
            \App\Middleware\AuthMiddleware::requireRole([1, 3]); // Admin y Recepción
            respond(201, $pagoController->registrar($input));
        }
        
        if ($method === 'PUT' && preg_match('#^/api/payments/(\d+)/anular$#', $path, $matches)) {
            \App\Middleware\AuthMiddleware::requireRole([1, 3]); // Admin y Recepción
            respond(200, $pagoController->anular((int)$matches[1]));
        }
    }

    // --- CATALOGOS ---
    if ($method === 'GET' && $path === '/api/catalogos') respond(200, (new CitaController())->obtenerCatalogos());
    
    // Auxiliares (Compatibilidad legacy)
    if ($method === 'GET' && $path === '/api/pacientes') respond(200, (new \App\Repositories\PacienteDAO())->findAll(1000)['data']);
    if ($method === 'GET' && $path === '/api/dentistas') respond(200, (new \App\Repositories\DentistaDAO())->findAll());
    if ($method === 'GET' && $path === '/api/tratamientos') respond(200, (new \App\Repositories\TratamientoDAO())->findAll());
    if ($method === 'GET' && $path === '/api/especialidades') respond(200, (new \App\Repositories\TratamientoDAO())->getEspecialidades());

    respond(404, ['error' => 'Ruta no encontrada', 'path' => $path]);

} catch (InvalidArgumentException $e) {
    respond(400, ['error' => $e->getMessage()]);
} catch (RuntimeException $e) {
    respond($e->getCode() ?: 401, ['error' => $e->getMessage()]);
} catch (Exception $e) {
    error_log("Error en API: " . $e->getMessage());
    respond(500, ['error' => 'Error interno del servidor']);
}
