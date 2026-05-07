<?php
require_once __DIR__ . '/../../../../php/database/conexion.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the raw POST data
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid JSON input.']);
        exit;
    }

    // Extract data with null coalescing to handle missing fields gracefully
    $nombre = $data['nombre'] ?? null;
    $categoria = $data['categoria'] ?? null;
    $descripcion = $data['descripcion'] ?? null;
    $cantidad = $data['cantidad'] ?? 0;
    $unidad_medida = $data['unidad_medida'] ?? null;
    $stock_minimo = $data['stock_minimo'] ?? 5;
    $proveedor = $data['proveedor'] ?? null;
    $costo_unitario = $data['costo_unitario'] ?? null;
    $ubicacion = $data['ubicacion'] ?? null;

    // Basic validation
    if (!$nombre || !$categoria || !is_numeric($cantidad)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Nombre, categoría y cantidad son campos obligatorios.']);
        exit;
    }

    try {
        $stmt = $db->prepare("INSERT INTO inventario (nombre, categoria, descripcion, cantidad, unidad_medida, stock_minimo, proveedor, costo_unitario, ubicacion) 
                              VALUES (:nombre, :categoria, :descripcion, :cantidad, :unidad_medida, :stock_minimo, :proveedor, :costo_unitario, :ubicacion)");
        
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':categoria', $categoria);
        $stmt->bindParam(':descripcion', $descripcion);
        $stmt->bindParam(':cantidad', $cantidad, PDO::PARAM_INT);
        $stmt->bindParam(':unidad_medida', $unidad_medida);
        $stmt->bindParam(':stock_minimo', $stock_minimo, PDO::PARAM_INT);
        $stmt->bindParam(':proveedor', $proveedor);
        $stmt->bindParam(':costo_unitario', $costo_unitario);
        $stmt->bindParam(':ubicacion', $ubicacion);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Ítem de inventario registrado correctamente.']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error al registrar el ítem en la base de datos.']);
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