<?php

namespace App\Http;

use App\Controllers\AuthController;
use App\Controllers\CitaController;
use App\Controllers\DashboardController;
use App\Controllers\PagoController;
use App\Controllers\UsuarioController;
use App\Middleware\AuthMiddleware;
use Exception;
use InvalidArgumentException;
use RuntimeException;

class FrontController
{
    private ?AuthController $authController = null;
    private ?DashboardController $dashboardController = null;
    private ?UsuarioController $usuarioController = null;
    private ?CitaController $citaController = null;
    private ?PagoController $pagoController = null;

    public function dispatch(): void
    {
        $this->configureHeaders();

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(204);
            exit;
        }

        $method = $_SERVER['REQUEST_METHOD'];
        $uri = $_SERVER['REQUEST_URI'] ?? '/';
        $path = parse_url($uri, PHP_URL_PATH) ?? '/';
        $path = $this->normalizePath($path);
        $input = $this->parseInput();

        error_log(
            'DEBUG_LOGIN method=' . $method .
            ' content_type=' . ($_SERVER['CONTENT_TYPE'] ?? '') .
            ' raw=' . json_encode(file_get_contents('php://input')) .
            ' parsed=' . json_encode($input) .
            ' json_error=' . json_last_error_msg()
        );

        try {
            $this->dispatchRoute($method, $path, $input);
        } catch (InvalidArgumentException $e) {
            $this->respond(400, ['error' => $e->getMessage()]);
        } catch (RuntimeException $e) {
            $this->respond($e->getCode() ?: 401, ['error' => $e->getMessage()]);
        } catch (Exception $e) {
            error_log('Error en API: ' . $e->getMessage());
            $this->respond(500, ['error' => 'Error interno del servidor']);
        }
    }

    private function dispatchRoute(string $method, string $path, array $input): void
    {
        if ($method === 'POST' && $path === '/api/auth/login') {
            $this->respond(200, $this->getAuthController()->login($input));
        }

        if ($method === 'GET' && $path === '/api/auth/me') {
            $this->respond(200, $this->getAuthController()->me());
        }

        if ($method === 'POST' && $path === '/api/auth/logout') {
            $this->respond(200, $this->getAuthController()->logout());
        }

        AuthMiddleware::requireAuth();

        if ($method === 'GET' && $path === '/api/dashboard') {
            AuthMiddleware::requireRole([1, 2, 3]);
            $this->respond(200, $this->getDashboardController()->getStats());
        }

        if (strpos($path, '/api/users') === 0) {
            AuthMiddleware::requireRole([1]);
            $controller = $this->getUsuarioController();
            if ($method === 'GET' && $path === '/api/users') {
                $this->respond(200, $controller->listar());
            }
            if ($method === 'POST' && $path === '/api/users') {
                $this->respond(201, $controller->registrar($input));
            }
            if ($method === 'PUT' && preg_match('#^/api/users/(\d+)$#', $path, $matches)) {
                $this->respond(200, $controller->actualizar((int) $matches[1], $input));
            }
            if ($method === 'DELETE' && preg_match('#^/api/users/(\d+)$#', $path, $matches)) {
                $this->respond(200, ['success' => $controller->eliminar((int) $matches[1])]);
            }
        }

        if (strpos($path, '/api/appointments') === 0) {
            $controller = $this->getCitaController();
            if ($method === 'GET' && $path === '/api/appointments') {
                $this->respond(200, $controller->listar());
            }

            if ($method === 'POST' && $path === '/api/appointments') {
                $this->respond(201, $controller->registrar($input));
            }

            if ($method === 'PUT' && preg_match('#^/api/appointments/(\d+)/status$#', $path, $matches)) {
                AuthMiddleware::requireRole([1, 2, 3]);
                $this->respond(200, $controller->cambiarEstado((int) $matches[1], $input['estado'] ?? ''));
            }

            if ($method === 'DELETE' && preg_match('#^/api/appointments/(\d+)$#', $path, $matches)) {
                AuthMiddleware::requireRole([1, 3]);
                $this->respond(200, $controller->eliminar((int) $matches[1]));
            }
        }

        if (strpos($path, '/api/payments') === 0) {
            $controller = $this->getPagoController();
            if ($method === 'GET' && $path === '/api/payments') {
                $this->respond(200, $controller->listar());
            }

            if ($method === 'POST' && $path === '/api/payments') {
                AuthMiddleware::requireRole([1, 3]);
                $this->respond(201, $controller->registrar($input));
            }

            if ($method === 'PUT' && preg_match('#^/api/payments/(\d+)/anular$#', $path, $matches)) {
                AuthMiddleware::requireRole([1, 3]);
                $this->respond(200, $controller->anular((int) $matches[1]));
            }
        }

        if ($method === 'GET' && $path === '/api/catalogos') {
            $this->respond(200, (new CitaController())->obtenerCatalogos());
        }

        if ($method === 'GET' && $path === '/api/pacientes') {
            $this->respond(200, (new \App\Repositories\PacienteDAO())->findAll(1000)['data']);
        }
        if ($method === 'GET' && $path === '/api/dentistas') {
            $this->respond(200, (new \App\Repositories\DentistaDAO())->findAll());
        }
        if ($method === 'GET' && $path === '/api/tratamientos') {
            $this->respond(200, (new \App\Repositories\TratamientoDAO())->findAll());
        }
        if ($method === 'GET' && $path === '/api/especialidades') {
            $this->respond(200, (new \App\Repositories\TratamientoDAO())->getEspecialidades());
        }

        $this->respond(404, ['error' => 'Ruta no encontrada', 'path' => $path]);
    }

    private function configureHeaders(): void
    {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        $allowedOrigins = ['http://localhost:4200', 'http://127.0.0.1:4200'];
        if (in_array($origin, $allowedOrigins, true)) {
            header("Access-Control-Allow-Origin: $origin");
        } else {
            header('Access-Control-Allow-Origin: http://localhost:4200');
        }

        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        header('Access-Control-Allow-Credentials: true');
        header('Content-Type: application/json; charset=UTF-8');
    }

    private function normalizePath(string $path): string
    {
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

        return '/' . ltrim($path, '/');
    }

    private function parseInput(): array
    {
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

        return $input;
    }

    private function respond(int $code, array $data): void
    {
        http_response_code($code);
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    private function getAuthController(): AuthController
    {
        if ($this->authController === null) {
            $this->authController = new AuthController();
        }

        return $this->authController;
    }

    private function getDashboardController(): DashboardController
    {
        if ($this->dashboardController === null) {
            $this->dashboardController = new DashboardController();
        }

        return $this->dashboardController;
    }

    private function getUsuarioController(): UsuarioController
    {
        if ($this->usuarioController === null) {
            $this->usuarioController = new UsuarioController();
        }

        return $this->usuarioController;
    }

    private function getCitaController(): CitaController
    {
        if ($this->citaController === null) {
            $this->citaController = new CitaController();
        }

        return $this->citaController;
    }

    private function getPagoController(): PagoController
    {
        if ($this->pagoController === null) {
            $this->pagoController = new PagoController();
        }

        return $this->pagoController;
    }
}
