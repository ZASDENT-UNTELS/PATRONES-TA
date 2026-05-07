<?php
require_once __DIR__ . '/../../../../php/database/conexion.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid JSON input.']);
        exit;
    }

    $id_item = $data['id_item'] ?? null;
    $nombre = $data['nombre'] ?? null;
    $categoria = $data['categoria'] ?? null;
    $descripcion = $data['descripcion'] ?? null;
    $cantidad = $data['cantidad'] ?? null;
    $unidad_medida = $data['unidad_medida'] ?? null;
    $stock_minimo = $data['stock_minimo'] ?? null;
    $proveedor = $data['proveedor'] ?? null;
    $costo_unitario = $data['costo_unitario'] ?? null;
    $ubicacion = $data['ubicacion'] ?? null;
    $activo = $data['activo'] ?? 1; // Default to 1 if not provided

    if (!$id_item || !$nombre || !$categoria || !is_numeric($cantidad)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID, nombre, categoría y cantidad son campos obligatorios.']);
        exit;
    }

    try {
        $stmt = $db->prepare("UPDATE inventario SET 
                                nombre = :nombre, 
                                categoria = :categoria, 
                                descripcion = :descripcion, 
                                cantidad = :cantidad, 
                                unidad_medida = :unidad_medida, 
                                stock_minimo = :stock_minimo, 
                                proveedor = :proveedor, 
                                costo_unitario = :costo_unitario, 
                                ubicacion = :ubicacion,
                                activo = :activo
                              WHERE id_item = :id_item");
        
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':categoria', $categoria);
        $stmt->bindParam(':descripcion', $descripcion);
        $stmt->bindParam(':cantidad', $cantidad, PDO::PARAM_INT);
        $stmt->bindParam(':unidad_medida', $unidad_medida);
        $stmt->bindParam(':stock_minimo', $stock_minimo, PDO::PARAM_INT);
        $stmt->bindParam(':proveedor', $proveedor);
        $stmt->bindParam(':costo_unitario', $costo_unitario);
        $stmt->bindParam(':ubicacion', $ubicacion);
        $stmt->bindParam(':activo', $activo, PDO::PARAM_INT);
        $stmt->bindParam(':id_item', $id_item, PDO::PARAM_INT);

        if ($stmt->execute()) {
            if ($stmt->rowCount() > 0) {
                echo json_encode(['success' => true, 'message' => 'Ítem de inventario actualizado correctamente.']);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'No se encontró el ítem o no se realizaron cambios.']);
            }
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error al actualizar el ítem en la base de datos.']);
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