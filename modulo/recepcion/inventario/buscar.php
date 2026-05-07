<?php
require_once '../../../php/database/conexion.php';
header('Content-Type: application/json');

$searchTerm = $_GET['search'] ?? '';

try {
    $sql = "SELECT * FROM inventario 
            WHERE activo = 1 AND (
                nombre LIKE :search OR 
                categoria LIKE :search OR 
                descripcion LIKE :search OR 
                proveedor LIKE :search OR
                ubicacion LIKE :search
            ) 
            ORDER BY id_item DESC";
    $stmt = $db->prepare($sql);
    $stmt->bindValue(':search', '%' . $searchTerm . '%', PDO::PARAM_STR);
    $stmt->execute();
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($items);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Error al buscar en el inventario: ' . $e->getMessage()]);
}
?>