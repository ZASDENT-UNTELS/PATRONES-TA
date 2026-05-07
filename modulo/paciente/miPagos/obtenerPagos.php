<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once '../../../php/database/conexion.php';
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['id_usuario']) || $_SESSION['id_rol'] != 4) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Acceso no autorizado.']);
    exit();
}

try {
    $conn = $db;
    $id_usuario = $_SESSION['id_usuario'];

    // 1. Obtener id_paciente asociado al usuario
    $sqlPaciente = "SELECT id_paciente FROM pacientes WHERE id_usuario = :id_usuario";
    $stmtPaciente = $conn->prepare($sqlPaciente);
    $stmtPaciente->bindParam(':id_usuario', $id_usuario, PDO::PARAM_INT);
    $stmtPaciente->execute();
    
    $paciente = $stmtPaciente->fetch(PDO::FETCH_ASSOC);
    
    if (!$paciente) {
        echo json_encode([
            'success' => false, 
            'message' => 'Paciente no encontrado en el sistema.'
        ]);
        exit();
    }
    
    $id_paciente = $paciente['id_paciente'];

    // 2. Obtener pagos usando id_paciente
    $sql = "SELECT
                p.id_pago,
                p.monto,
                p.metodo_pago,
                p.estado,
                p.referencia,
                p.fecha_pago,
                p.notas,
                CONCAT('Cita #', c.id_cita, ' - ', t.nombre) as cita_info
            FROM pagos p
            LEFT JOIN citas c ON p.id_cita = c.id_cita
            LEFT JOIN tratamientos t ON c.id_tratamiento = t.id_tratamiento
            WHERE c.id_paciente = :id_paciente
            ORDER BY p.fecha_pago DESC";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':id_paciente', $id_paciente, PDO::PARAM_INT);
    $stmt->execute();

    $pagos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'data' => $pagos]);

} catch (PDOException $e) {
    error_log("Database Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Error en base de datos: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    error_log("General Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Error general: ' . $e->getMessage()
    ]);
}
?>