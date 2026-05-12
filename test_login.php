<?php
require_once 'vendor/autoload.php';
require_once 'src/database/conexion.php';
require_once 'src/service/AuthService.php';

echo "=== Prueba de Login ===\n\n";

$auth = new AuthService();

// Obtener usuario admin de la BD para ver su estructura
$db = Database::getInstance();
$conn = $db->getConnection();
$stmt = $conn->prepare("SELECT id_usuario, usuario_usuario, nombre_apellido, id_rol FROM usuarios WHERE usuario_usuario = 'admin' LIMIT 1");
$stmt->execute();
$adminUser = $stmt->fetch(PDO::FETCH_ASSOC);

if ($adminUser) {
    echo "Usuario admin encontrado:\n";
    echo "  - ID: {$adminUser['id_usuario']}\n";
    echo "  - Usuario: {$adminUser['usuario_usuario']}\n";
    echo "  - Nombre: {$adminUser['nombre_apellido']}\n";
    echo "  - Rol ID: {$adminUser['id_rol']}\n\n";
}

// Intentar login
try {
    $result = $auth->login('admin', 'admin123');
    echo "✓ Login exitoso con contraseña 'admin123'\n";
    echo "  - Respuesta: " . json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n";
} catch (Exception $e) {
    echo "✗ Login fallido con 'admin123': " . $e->getMessage() . "\n\n";
    echo "Nota: Esta es una prueba de validación. El hash correcto\n";
    echo "se puede verificar en la BD directamente.\n";
}
