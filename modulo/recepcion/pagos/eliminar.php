<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

  require_once '../../../php/database/conexion.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    if (!isset($db) || !$db instanceof PDO) {
        throw new Exception("Error: La conexión a la base de datos no está disponible.");
    }

    // Obtener y decodificar el cuerpo JSON de la solicitud
    $data = json_decode(file_get_contents('php://input'), true);

    // Validar que se recibió el ID del pago
    if (!isset($data['id']) || empty($data['id'])) {
        http_response_code(400); // Bad Request
        echo json_encode(['success' => false, 'message' => 'ID de pago no proporcionado para eliminar.']);
        exit();
    }

    $id_pago = filter_var($data['id'], FILTER_VALIDATE_INT);

    if ($id_pago === false || $id_pago === null) {
        http_response_code(400); // Bad Request
        echo json_encode(['success' => false, 'message' => 'ID de pago inválido.']);
        exit();
    }

    // Iniciar transacción (opcional pero recomendado para operaciones de eliminación)
    $db->beginTransaction();

    // Consulta para eliminar el pago
    $query = "DELETE FROM pagos WHERE id_pago = :id_pago";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id_pago', $id_pago, PDO::PARAM_INT);
    $stmt->execute();

    // Verificar si se eliminó alguna fila
    if ($stmt->rowCount() > 0) {
        $db->commit(); // Confirmar la transacción
        echo json_encode(['success' => true, 'message' => 'Pago eliminado correctamente.']);
    } else {
        $db->rollBack(); // Revertir si no se encontró el pago
        http_response_code(404); // Not Found
        echo json_encode(['success' => false, 'message' => 'Pago no encontrado o ya eliminado.']);
    }

} catch (PDOException $e) {
    // Revertir la transacción si algo falla
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    error_log("Error PDO en eliminar_pago.php: " . $e->getMessage());
    http_response_code(500); // Internal Server Error
    echo json_encode([
        'success' => false,
        'message' => 'Error de base de datos al eliminar el pago: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    // Revertir la transacción si algo falla
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    error_log("Error general en eliminar_pago.php: " . $e->getMessage());
    http_response_code(500); // Internal Server Error (or 400 if it's a client-side data issue)
    echo json_encode([
        'success' => false,
        'message' => 'Error al eliminar el pago: ' . $e->getMessage()
    ]);
}
?>