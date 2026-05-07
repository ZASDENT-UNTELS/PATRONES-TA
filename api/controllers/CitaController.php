<?php
/**
 * CitaController (Patrón MVC - Controlador)
 * 
 * Se encarga de manejar las peticiones HTTP relacionadas con citas,
 * validar las entradas básicas y delegar la lógica de negocio al Service Layer.
 */

// Como estamos en /api/controllers/CitaController.php, necesitamos subir 2 niveles para llegar a php/service/CitaService.php
require_once __DIR__ . '/../../php/service/CitaService.php';

class CitaController
{
    private CitaService $citaService;

    public function __construct()
    {
        // Instanciamos el servicio (Service Layer Pattern)
        $this->citaService = new CitaService();
    }

    public function processRequest(string $method, ?int $id): void
    {
        switch ($method) {
            case 'GET':
                if ($id) {
                    // Aquí podríamos tener un $this->citaService->obtener($id)
                    $this->methodNotAllowed();
                } else {
                    // Por ahora como ejemplo devolvemos todas o manejamos parámetros
                    // $this->citaService->listarPorDentista(...)
                    $this->methodNotAllowed();
                }
                break;
            case 'POST':
                $this->createCita();
                break;
            case 'PUT':
                $this->methodNotAllowed();
                break;
            case 'DELETE':
                $this->methodNotAllowed();
                break;
            default:
                $this->methodNotAllowed();
                break;
        }
    }

    private function createCita(): void
    {
        // Obtener los datos JSON del cuerpo de la petición (de Angular)
        $input = (array) json_decode(file_get_contents('php://input'), true);
        
        // Si no hay json, intentamos leer $_POST (por si es form-data)
        if (empty($input)) {
            $input = $_POST;
        }

        try {
            // Delegamos la creación al Service Layer
            // El Service Layer usará el DTO y el DAO para procesarlo (Patrones aplicados)
            $result = $this->citaService->crear($input);
            
            http_response_code(201); // Created
            echo json_encode($result);
        } catch (InvalidArgumentException $e) {
            http_response_code(400); // Bad Request
            echo json_encode(['error' => $e->getMessage()]);
        } catch (RuntimeException $e) {
            http_response_code(422); // Unprocessable Entity
            echo json_encode(['error' => $e->getMessage()]);
        } catch (Exception $e) {
            http_response_code(500); // Internal Server Error
            echo json_encode(['error' => 'Error interno del servidor']);
        }
    }

    private function methodNotAllowed(): void
    {
        http_response_code(405); // Method Not Allowed
        echo json_encode(['error' => 'Método no permitido']);
    }
}
