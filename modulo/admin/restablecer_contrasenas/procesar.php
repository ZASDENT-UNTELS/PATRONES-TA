<?php
header('Content-Type: application/json');
session_start();

// Configuración de la base de datos
$host = '51.222.104.23';
$dbname = 'androlag_albumclinica--nuevo';
$username = 'androlag_sanchez';
$password = 'Biblia123456789/#';

try {
    $db = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error de conexión a la base de datos'
    ]);
    exit;
}

// Obtener datos de la solicitud
$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? '';

// Procesar acciones
if ($action === 'request_reset') {
    $email = $input['email'] ?? '';
    
    // Validación básica
    if (empty($email)) {
        echo json_encode([
            'success' => false,
            'message' => 'Por favor ingresa tu correo electrónico'
        ]);
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            'success' => false,
            'message' => 'Formato de correo electrónico inválido'
        ]);
        exit;
    }
    
    // Verificar si el email existe
    try {
        $stmt = $db->prepare("SELECT id_usuario FROM usuarios WHERE email = ?");
        $stmt->execute([$email]);
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($usuario) {
            // Generar contraseña temporal
            $temp_password = substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'), 0, 8);
            
            // Actualizar contraseña en texto plano
            $stmt = $db->prepare("UPDATE usuarios SET usuario_clave = ? WHERE id_usuario = ?");
            $stmt->execute([$temp_password, $usuario['id_usuario']]);
            
            echo json_encode([
                'success' => true,
                'temp_password' => $temp_password
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'No existe una cuenta con ese email'
            ]);
        }
    } catch (PDOException $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error en la base de datos: ' . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Acción no válida'
    ]);
}
?>