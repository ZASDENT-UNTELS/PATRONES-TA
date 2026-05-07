<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

// Ajusta esta ruta a la ubicación real de tu conexion.php
require_once __DIR__ . '/../../../../php/database/conexion.php'; 

try {
    // La instancia global $db ya está disponible desde conexion.php (si usas la clase Database y la instanciás)
    // O si usas una conexión directa, asegúrate de que $db esté inicializado
    $database = new Database();
    $db = $database->getConnection();

    if (!isset($db) || !$db instanceof PDO) {
        throw new Exception("Error: La conexión a la base de datos no está disponible.");
    }

    // Obtener el ID del pago de la URL (GET request)
    $id_pago = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

    if ($id_pago === false || $id_pago === null) {
        http_response_code(400); // Bad Request
        echo json_encode(['success' => false, 'message' => 'ID de pago inválido o no proporcionado.']);
        exit();
    }

    // Consulta para obtener los datos del pago y la información de la cita/paciente asociada
    $query = "
        SELECT 
            p.id_pago,
            p.id_cita,
            p.monto,
            p.metodo_pago,
            p.estado,
            p.referencia,
            p.fecha_pago,
            p.notas,
            c.fecha_hora AS fecha_hora_cita,
            COALESCE(u.nombre_apellido, 'Sin paciente asignado') AS nombre_paciente,
            t.nombre AS nombre_tratamiento
        FROM 
            pagos p
        LEFT JOIN 
            citas c ON p.id_cita = c.id_cita
        LEFT JOIN 
            pacientes pa ON c.id_paciente = pa.id_paciente
        LEFT JOIN
            usuarios u ON pa.id_usuario = u.id_usuario
        LEFT JOIN
            tratamientos t ON c.id_tratamiento = t.id_tratamiento
        WHERE 
            p.id_pago = :id_pago
    ";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id_pago', $id_pago, PDO::PARAM_INT);
    $stmt->execute();
    $pago = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($pago) {
        echo json_encode(['success' => true, 'data' => $pago]);
    } else {
        http_response_code(404); // Not Found
        echo json_encode(['success' => false, 'message' => 'Pago no encontrado.']);
    }

} catch (PDOException $e) {
    error_log("Error PDO en obtener_pago.php: " . $e->getMessage());
    http_response_code(500); // Internal Server Error
    echo json_encode([
        'success' => false,
        'message' => 'Error de base de datos al obtener el pago: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    error_log("Error general en obtener_pago.php: " . $e->getMessage());
    http_response_code(500); // Internal Server Error
    echo json_encode([
        'success' => false,
        'message' => 'Error al obtener el pago: ' . $e->getMessage()
    ]);
}
?>