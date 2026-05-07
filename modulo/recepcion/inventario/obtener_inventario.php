<?php
require_once '../../../php/database/conexion.php';
header('Content-Type: application/json');

try {
    $stmt = $db->prepare("SELECT * FROM inventario WHERE activo = 1 ORDER BY id_item DESC");
    $stmt->execute();
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($items);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Error al obtener el inventario: ' . $e->getMessage()]);
}
?>