<?php
require_once __DIR__ . '/../../../../php/database/conexion.php';
header('Content-Type: application/json');

$id_item = $_GET['id'] ?? null;

try {
    if ($id_item) {
        $stmt = $db->prepare("SELECT * FROM inventario WHERE id_item = :id_item AND activo = 1");
        $stmt->bindParam(':id_item', $id_item, PDO::PARAM_INT);
        $stmt->execute();
        $item = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($item ? [$item] : []); // Return as an array to match fetch().then(data && data.length > 0)
    } else {
        // If no ID is provided, return all active items (useful for a general list if needed)
        $stmt = $db->prepare("SELECT * FROM inventario WHERE activo = 1 ORDER BY id_item DESC");
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($items);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Error al obtener el ítem: ' . $e->getMessage()]);
}
?>