<?php
/**
 * AuthController (Patrón MVC - Controlador)
 * 
 * Se encarga de manejar las peticiones HTTP relacionadas con autenticación,
 * validar las entradas básicas y delegar la lógica de negocio al Service Layer.
 */

require_once __DIR__ . '/../../php/service/AuthService.php';

class AuthController
{
    private AuthService $authService;

    public function __construct()
    {
        $this->authService = new AuthService();
    }

    public function processRequest(string $method, ?string $action = null): void
    {
        if ($method === 'POST') {
            if ($action === 'login') {
                $this->login();
            } elseif ($action === 'logout') {
                $this->logout();
            } else {
                $this->methodNotAllowed();
            }
        } elseif ($method === 'GET' && $action === 'me') {
            $this->me();
        } else {
            $this->methodNotAllowed();
        }
    }

    private function login(): void
    {
        $input = (array) json_decode(file_get_contents('php://input'), true);
        if (empty($input)) {
            $input = $_POST;
        }

        try {
            $username = $input['username'] ?? '';
            $password = $input['password'] ?? '';
            $result = $this->authService->login($username, $password);
            
            http_response_code(200);
            echo json_encode($result);
        } catch (InvalidArgumentException $e) {
            http_response_code(400); // Bad Request
            echo json_encode(['error' => $e->getMessage()]);
        } catch (RuntimeException $e) {
            http_response_code(401); // Unauthorized
            echo json_encode(['error' => $e->getMessage()]);
        } catch (Exception $e) {
            http_response_code(500); // Internal Server Error
            echo json_encode(['error' => 'Error interno del servidor']);
        }
    }

    private function logout(): void
    {
        $this->authService->logout();
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Sesión cerrada']);
    }

    private function me(): void
    {
        if ($this->authService->estaAutenticado()) {
            http_response_code(200);
            echo json_encode(['success' => true, 'usuario' => $this->authService->usuarioActual()]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'No autenticado']);
        }
    }

    private function methodNotAllowed(): void
    {
        http_response_code(405); // Method Not Allowed
        echo json_encode(['error' => 'Método o acción no permitida']);
    }
}
