<?php
/**
 * test_registro.php — Prueba del flujo de registro de usuarios
 */

define('ROOT_PATH', __DIR__);

require_once ROOT_PATH . '/vendor/autoload.php';

// ── Conectar a la base de datos ─────────────────────────────────────────

try {
    require_once ROOT_PATH . '/src/database/conexion.php';
    
    $db = Database::getInstance();
    $conn = $db->getConnection();
    
    echo "✓ Conexión a la base de datos exitosa.\n";
    
    // Verificar que la tabla usuarios existe y tiene la estructura correcta
    $stmt = $conn->query("DESCRIBE usuarios");
    $columnas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "\n✓ Estructura de tabla 'usuarios':\n";
    echo "┌────────────────────┬─────────────────┬────────────┐\n";
    echo "│ Campo              │ Tipo            │ Nullable   │\n";
    echo "├────────────────────┼─────────────────┼────────────┤\n";
    
    foreach ($columnas as $col) {
        $nombre = str_pad($col['Field'], 18);
        $tipo = str_pad(substr($col['Type'], 0, 15), 15);
        $nullable = $col['Null'] === 'YES' ? 'SÍ' : 'NO';
        echo "│ {$nombre} │ {$tipo} │ {$nullable}     │\n";
    }
    echo "└────────────────────┴─────────────────┴────────────┘\n";
    
} catch (Exception $e) {
    echo "✗ Error de conexión: " . $e->getMessage() . "\n";
    exit(1);
}

// ── Cargar servicios y DAOs ────────────────────────────────────────────

require_once ROOT_PATH . '/models/UsuarioDAO.php';
require_once ROOT_PATH . '/src/service/UsuarioService.php';

echo "\n✓ Servicios y DAOs cargados correctamente.\n";

// ── Probar validaciones del UsuarioService ────────────────────────────

$service = new UsuarioService();

echo "\n=== Pruebas de Validación ===\n\n";

// Prueba 1: Campos faltantes
echo "Prueba 1: Campos faltantes\n";
try {
    $service->registrar(['email' => 'test@example.com']);
    echo "✗ Debería haber lanzado excepción por campos faltantes\n";
} catch (InvalidArgumentException $e) {
    echo "✓ Excepción capturada: " . $e->getMessage() . "\n";
}

// Prueba 2: Email inválido
echo "\nPrueba 2: Email inválido\n";
try {
    $service->registrar([
        'nombre_apellido' => 'Test User',
        'usuario_usuario' => 'testuser',
        'email' => 'email-invalido',
        'password' => 'password123',
        'id_rol' => 2
    ]);
    echo "✗ Debería haber lanzado excepción por email inválido\n";
} catch (InvalidArgumentException $e) {
    echo "✓ Excepción capturada: " . $e->getMessage() . "\n";
}

// Prueba 3: Contraseña muy corta
echo "\nPrueba 3: Contraseña muy corta\n";
try {
    $service->registrar([
        'nombre_apellido' => 'Test User',
        'usuario_usuario' => 'testuser',
        'email' => 'testuser@example.com',
        'password' => '123',
        'id_rol' => 2
    ]);
    echo "✗ Debería haber lanzado excepción por contraseña corta\n";
} catch (InvalidArgumentException $e) {
    echo "✓ Excepción capturada: " . $e->getMessage() . "\n";
}

// Prueba 4: Registrar usuario válido (nuevo)
echo "\nPrueba 4: Registrar usuario válido (nuevo)\n";
$testUsername = 'testuser_' . uniqid();
$testEmail = 'test_' . uniqid() . '@example.com';

try {
    $result = $service->registrar([
        'nombre_apellido' => 'Usuario Prueba',
        'usuario_usuario' => $testUsername,
        'email' => $testEmail,
        'password' => 'SecurePass123!',
        'id_rol' => 4,
        'telefono' => '+51987654321'
    ]);
    
    if ($result['success'] && isset($result['id'])) {
        echo "✓ Usuario registrado exitosamente.\n";
        echo "  - ID: {$result['id']}\n";
        echo "  - Mensaje: {$result['message']}\n";
        
        $userId = $result['id'];
    } else {
        echo "✗ Respuesta inesperada: " . json_encode($result) . "\n";
    }
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}

// Prueba 5: Intentar registrar con usuario duplicado
echo "\nPrueba 5: Intentar registrar con usuario duplicado\n";
try {
    $service->registrar([
        'nombre_apellido' => 'Otro Usuario',
        'usuario_usuario' => $testUsername,
        'email' => 'otroemail@example.com',
        'password' => 'AnotherPass123!',
        'id_rol' => 2
    ]);
    echo "✗ Debería haber lanzado excepción por usuario duplicado\n";
} catch (RuntimeException $e) {
    echo "✓ Excepción capturada: " . $e->getMessage() . "\n";
}

// Prueba 6: Verificar que el usuario se guardó correctamente
echo "\nPrueba 6: Verificar que el usuario se guardó en BD\n";
try {
    $dao = new UsuarioDAO();
    $usuario = $dao->findById($userId);
    
    if ($usuario) {
        echo "✓ Usuario encontrado en BD.\n";
        echo "  - Nombre: {$usuario['nombre_apellido']}\n";
        echo "  - Usuario: {$usuario['usuario_usuario']}\n";
        echo "  - Email: {$usuario['email']}\n";
        echo "  - Rol: {$usuario['nombre_rol']}\n";
        echo "  - Activo: {$usuario['activo']}\n";
    } else {
        echo "✗ Usuario no encontrado en BD\n";
    }
} catch (Exception $e) {
    echo "✗ Error al buscar usuario: " . $e->getMessage() . "\n";
}

// Prueba 7: Listar todos los usuarios
echo "\nPrueba 7: Listar todos los usuarios\n";
try {
    $dao = new UsuarioDAO();
    $usuarios = $dao->findAll();
    echo "✓ Total de usuarios en BD: " . count($usuarios) . "\n";
    
    if (!empty($usuarios)) {
        echo "\n  Últimos 3 usuarios:\n";
        $ultimos = array_slice($usuarios, -3);
        foreach ($ultimos as $usr) {
            $nombre = str_pad(substr($usr['nombre_apellido'], 0, 20), 20);
            $user = str_pad(substr($usr['usuario_usuario'], 0, 15), 15);
            $rol = $usr['nombre_rol'] ?? 'N/A';
            echo "  - {$nombre} | {$user} | {$rol}\n";
        }
    }
} catch (Exception $e) {
    echo "✗ Error al listar usuarios: " . $e->getMessage() . "\n";
}

// Prueba 8: Verificar roles disponibles
echo "\nPrueba 8: Verificar roles disponibles en BD\n";
try {
    $stmt = $conn->query("SELECT id_rol, nombre, descripcion FROM roles ORDER BY id_rol");
    $roles = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "✓ Roles del sistema:\n";
    foreach ($roles as $rol) {
        echo "  - [{$rol['id_rol']}] {$rol['nombre']}: {$rol['descripcion']}\n";
    }
} catch (Exception $e) {
    echo "✗ Error al leer roles: " . $e->getMessage() . "\n";
}

echo "\n=== Pruebas completadas ===\n";
