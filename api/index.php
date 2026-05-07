<?php
/**
 * Front Controller (Patrón Front Controller)
 * 
 * Todas las peticiones a la API pasan por este único punto de entrada.
 * Esto centraliza la seguridad, el manejo de CORS, y el enrutamiento.
 */

// Habilitar CORS para permitir peticiones desde Angular
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Manejar peticiones preflight (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Obtener la URL solicitada (en un entorno real usaríamos mod_rewrite en Apache)
// Por simplicidad, asumiremos que se pasa por parámetro GET 'route' o leyendo REQUEST_URI
$request_uri = $_SERVER['REQUEST_URI'];
$base_path = '/zazdent/api/'; // Ajustar si el proyecto está en otro directorio
$route = str_replace($base_path, '', parse_url($request_uri, PHP_URL_PATH));

// Router rudimentario (MVC - Routing)
$routes = [
    'auth' => 'AuthController',
    'citas' => 'CitaController',
    'tratamientos' => 'TratamientoController',
    'dentistas' => 'DentistaController',
];

// Extraer el recurso base (ej: 'citas' de 'citas/123')
$parts = explode('/', trim($route, '/'));
$resource = $parts[0];
$idOrAction = isset($parts[1]) ? $parts[1] : null;

if (array_key_exists($resource, $routes)) {
    $controllerName = $routes[$resource];
    $controllerFile = __DIR__ . '/controllers/' . $controllerName . '.php';

    if (file_exists($controllerFile)) {
        require_once $controllerFile;
        
        $controller = new $controllerName();
        $method = $_SERVER['REQUEST_METHOD'];
        
        // Ejecutar el método correspondiente del controlador
        if ($resource === 'auth') {
            $controller->processRequest($method, $idOrAction);
        } else {
            $controller->processRequest($method, $idOrAction !== null ? (int)$idOrAction : null);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Controlador no encontrado']);
    }
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Ruta no encontrada']);
}
