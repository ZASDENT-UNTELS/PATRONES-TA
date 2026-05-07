<?php
require_once '../../../php/database/conexion.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id_item = $_POST['id_item'] ?? null;

    if (!$id_item) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID de ítem no proporcionado.']);
        exit;
    }

    try {
        // Soft delete: set 'activo' to 0 instead of deleting the row
        $stmt = $db->prepare("UPDATE inventario SET activo = 0 WHERE id_item = :id_item");
        $stmt->bindParam(':id_item', $id_item, PDO::PARAM_INT);

        if ($stmt->execute()) {
            if ($stmt->rowCount() > 0) {
                echo json_encode(['success' => true, 'message' => 'Ítem eliminado (desactivado) correctamente.']);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Ítem no encontrado o ya estaba inactivo.']);
            }
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error al eliminar el ítem.']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error de base de datos: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
}
?>