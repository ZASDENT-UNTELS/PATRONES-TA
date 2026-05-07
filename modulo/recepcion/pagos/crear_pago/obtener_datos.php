<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');


require_once __DIR__ . '/../../../../php/database/conexion.php'; 

try {
    // La instancia global $db ya está disponible desde conexion.php
    if (!isset($db) || !$db instanceof PDO) {
        throw new Exception("Error: La conexión a la base de datos no está disponible.");
    }

    // Consulta para obtener citas que no estén 'Completada' o 'Cancelada' y el nombre del paciente asociado.
    // También excluí 'Reembolsado' para citas que ya están "pagadas" y reembolsadas.
    $query = "
       SELECT 
    c.id_cita, 
    c.fecha_hora, 
    COALESCE(u.nombre_apellido, 'Sin usuario asignado') AS nombre_paciente
FROM 
    citas c
LEFT JOIN 
    pacientes p ON c.id_paciente = p.id_paciente
LEFT JOIN 
    usuarios u ON p.id_usuario = u.id_usuario;
    ";
    
    $stmt = $db->query($query);
    $citas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'data' => $citas]);

} catch (PDOException $e) {
    error_log("Error PDO en obtener_datos.php: " . $e->getMessage());
    http_response_code(500); // Internal Server Error
    echo json_encode([
        'success' => false,
        'message' => 'Error de base de datos al obtener citas: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    error_log("Error en obtener_datos.php: " . $e->getMessage());
    http_response_code(500); // Internal Server Error
    echo json_encode([
        'success' => false,
        'message' => 'Error general al obtener citas: ' . $e->getMessage()
    ]);
}
?>