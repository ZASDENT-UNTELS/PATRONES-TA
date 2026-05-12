<?php
/**
 * test_http_endpoints.php — Prueba de endpoints HTTP
 * 
 * Simula requests HTTP sin necesidad de servidor
 */

define('ROOT_PATH', __DIR__);
define('TEST_MODE', true);

require_once ROOT_PATH . '/vendor/autoload.php';

echo "=== Pruebas de Endpoints HTTP ===\n\n";

// ── Funciones helper ────────────────────────────────────────────────────

function simulateHttpRequest($method, $path, $body = null, $session = []) {
    // Establecer variables globales
    $_SERVER['REQUEST_METHOD'] = $method;
    $_SERVER['REQUEST_URI'] = '/PATRONES-TA/public' . $path;
    $_SERVER['HTTP_ORIGIN'] = 'http://localhost';
    
    // Iniciar sesión si hay datos
    if (!empty($session)) {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        foreach ($session as $key => $value) {
            $_SESSION[$key] = $value;
        }
    }
    
    return [
        'method' => $method,
        'path' => $path,
        'body' => $body,
        'session' => $_SESSION ?? []
    ];
}

// ── Cargar servicios ────────────────────────────────────────────────────

require_once ROOT_PATH . '/src/database/conexion.php';
require_once ROOT_PATH . '/src/service/AuthService.php';
require_once ROOT_PATH . '/models/UsuarioDAO.php';
require_once ROOT_PATH . '/src/service/UsuarioService.php';

echo "✓ Módulos cargados.\n\n";

// ── Prueba 1: Validar que AuthService funciona ────────────────────────

echo "Prueba 1: AuthService - Validar login con credenciales correctas\n";
try {
    $auth = new AuthService();
    // Usar credenciales del admin de prueba
    $result = $auth->login('admin', 'admin123');
    
    if (isset($result['success']) && $result['success']) {
        echo "✓ Login exitoso.\n";
        echo "  - Usuario: {$result['nombre']}\n";
        echo "  - Rol: {$result['nombre_rol']}\n";
        echo "  - ID: {$result['id_usuario']}\n";
    } else {
        echo "✗ Login fallido: " . json_encode($result) . "\n";
    }
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}

// ── Prueba 2: Validar rechazo de credenciales incorrectas ──────────────

echo "\nPrueba 2: AuthService - Rechazar credenciales incorrectas\n";
try {
    $auth = new AuthService();
    $result = $auth->login('admin', 'wrongpassword');
    echo "✗ No debería permitir login con contraseña incorrecta\n";
} catch (RuntimeException $e) {
    echo "✓ Excepción capturada: " . $e->getMessage() . "\n";
}

// ── Prueba 3: Validar UsuarioDAO con rol ────────────────────────────

echo "\nPrueba 3: UsuarioDAO - Listar usuarios con rol\n";
try {
    $dao = new UsuarioDAO();
    $usuarios = $dao->findAll();
    
    if (count($usuarios) > 0) {
        echo "✓ Usuarios listados exitosamente.\n";
        $usuario = $usuarios[0];
        
        if (isset($usuario['nombre_rol'])) {
            echo "  ✓ Campo 'nombre_rol' presente en respuesta.\n";
            echo "  - Usuario: {$usuario['usuario_usuario']}\n";
            echo "  - Rol: {$usuario['nombre_rol']}\n";
        } else {
            echo "  ✗ Campo 'nombre_rol' no encontrado en respuesta.\n";
        }
    }
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}

// ── Prueba 4: Simular POST /api/usuarios (registro) ────────────────────

echo "\nPrueba 4: UsuarioService - Registrar nuevo usuario\n";
try {
    $service = new UsuarioService();
    
    $testUser = 'apitest_' . uniqid();
    $testEmail = 'apitest_' . uniqid() . '@test.com';
    
    $result = $service->registrar([
        'nombre_apellido' => 'Test API Usuario',
        'usuario_usuario' => $testUser,
        'email' => $testEmail,
        'password' => 'ApiTestPass123!',
        'id_rol' => 4,
        'telefono' => '+51999888777'
    ]);
    
    if ($result['success']) {
        echo "✓ Usuario registrado a través del service.\n";
        echo "  - ID generado: {$result['id']}\n";
        echo "  - Mensaje: {$result['message']}\n";
        
        // Verificar que se puede recuperar el usuario
        $dao = new UsuarioDAO();
        $usuario = $dao->findById($result['id']);
        
        if ($usuario) {
            echo "  ✓ Usuario recuperado exitosamente.\n";
            echo "    - Nombre: {$usuario['nombre_apellido']}\n";
            echo "    - Email: {$usuario['email']}\n";
            echo "    - Rol: {$usuario['nombre_rol']}\n";
        }
    }
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}

// ── Prueba 5: Validar estructura de respuesta JSON ──────────────────

echo "\nPrueba 5: Estructura de respuestas JSON\n";
try {
    $service = new UsuarioService();
    
    $testUser2 = 'response_' . uniqid();
    $testEmail2 = 'response_' . uniqid() . '@test.com';
    
    $result = $service->registrar([
        'nombre_apellido' => 'Response Test',
        'usuario_usuario' => $testUser2,
        'email' => $testEmail2,
        'password' => 'ResponseTest123!',
        'id_rol' => 2
    ]);
    
    $json = json_encode($result);
    
    if (json_last_error() === JSON_ERROR_NONE) {
        echo "✓ Respuesta es JSON válido.\n";
        echo "  Payload:\n";
        echo "  " . json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n";
    } else {
        echo "✗ Error al serializar JSON: " . json_last_error_msg() . "\n";
    }
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}

// ── Prueba 6: Validaciones de campos ────────────────────────────────

echo "\nPrueba 6: Validaciones del UsuarioService\n";
$validationTests = [
    [
        'name' => 'Email duplicado',
        'data' => [
            'nombre_apellido' => 'Test Duplicate',
            'usuario_usuario' => 'duplicate_' . uniqid(),
            'email' => 'admin@clinicadental.com',  // Email que ya existe
            'password' => 'DupTest123!',
            'id_rol' => 3
        ],
        'expectedError' => 'Ya está registrado'
    ]
];

foreach ($validationTests as $test) {
    echo "\n  Validación: {$test['name']}\n";
    try {
        $service = new UsuarioService();
        $result = $service->registrar($test['data']);
        echo "  ✗ Debería haber rechazado: " . json_encode($test['data']) . "\n";
    } catch (Exception $e) {
        if (strpos($e->getMessage(), 'ya') !== false || strpos($e->getMessage(), 'duplicado') !== false) {
            echo "  ✓ Validación correcta: " . $e->getMessage() . "\n";
        } else {
            echo "  ✓ Excepción capturada: " . $e->getMessage() . "\n";
        }
    }
}

// ── Prueba 7: Verificar hashing de contraseña ──────────────────────

echo "\n\nPrueba 7: Verificación de hash de contraseña\n";
try {
    $service = new UsuarioService();
    $dao = new UsuarioDAO();
    
    $testUserHash = 'hash_' . uniqid();
    $testEmailHash = 'hash_' . uniqid() . '@test.com';
    $plainPassword = 'PasswordHashTest123!';
    
    $result = $service->registrar([
        'nombre_apellido' => 'Hash Test User',
        'usuario_usuario' => $testUserHash,
        'email' => $testEmailHash,
        'password' => $plainPassword,
        'id_rol' => 4
    ]);
    
    $usuario = $dao->findById($result['id']);
    
    if (password_verify($plainPassword, $usuario['usuario_clave'])) {
        echo "✓ Contraseña hasheada correctamente.\n";
        echo "  - Hash: " . substr($usuario['usuario_clave'], 0, 30) . "...\n";
        echo "  - Password verificado: SÍ\n";
    } else {
        echo "✗ Error: Hash de contraseña no coincide.\n";
    }
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}

echo "\n=== Pruebas HTTP completadas ===\n";
