<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

// Ajusta esta ruta a la ubicación real de tu conexion.php
require_once __DIR__ . '/../../../../php/database/conexion.php'; 

try {
    // Validar que la conexión a la base de datos esté disponible
    if (!isset($db) || !$db instanceof PDO) {
        throw new Exception("Error: La conexión a la base de datos no está disponible.");
    }

    // Obtener y decodificar el cuerpo JSON de la solicitud
    $data = json_decode(file_get_contents('php://input'), true);

    // Validar campos obligatorios
    $required_fields = ['id_cita', 'monto', 'metodo_pago', 'estado', 'fecha_pago'];
    foreach ($required_fields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            http_response_code(400); // Bad Request
            echo json_encode(['success' => false, 'message' => "El campo '$field' es obligatorio."]);
            exit();
        }
    }

    // Limpiar y sanitizar datos (ajustar según sea necesario para seguridad)
    $id_cita = filter_var($data['id_cita'], FILTER_VALIDATE_INT);
    $monto = filter_var($data['monto'], FILTER_VALIDATE_FLOAT);
    $metodo_pago = filter_var($data['metodo_pago'], FILTER_SANITIZE_STRING);
    $estado = filter_var($data['estado'], FILTER_SANITIZE_STRING);
    $referencia = filter_var($data['referencia'] ?? null, FILTER_SANITIZE_STRING); // Opcional
    $fecha_pago = filter_var($data['fecha_pago'], FILTER_SANITIZE_STRING);
    $notas = filter_var($data['notas'] ?? null, FILTER_SANITIZE_STRING); // Opcional

    // Validación adicional de tipos y valores
    if ($id_cita === false || $monto === false || $monto < 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Datos de entrada inválidos para ID de cita o monto.']);
        exit();
    }
    // Asegurarse de que fecha_pago tiene el formato correcto para MySQL
    $fecha_pago_mysql = str_replace('T', ' ', $fecha_pago) . ':00'; // Convierte 'YYYY-MM-DDTHH:MM' a 'YYYY-MM-DD HH:MM:00'

    // Iniciar transacción (para asegurar la atomicidad de la inserción y actualización)
    $db->beginTransaction();

    // 1. Insertar el nuevo pago
    $query_insert_pago = "
        INSERT INTO pagos (id_cita, monto, metodo_pago, estado, referencia, fecha_pago, notas)
        VALUES (:id_cita, :monto, :metodo_pago, :estado, :referencia, :fecha_pago, :notas)
    ";
    $stmt_pago = $db->prepare($query_insert_pago);
    $stmt_pago->bindParam(':id_cita', $id_cita, PDO::PARAM_INT);
    $stmt_pago->bindParam(':monto', $monto, PDO::PARAM_STR); // Usar PARAM_STR para decimales
    $stmt_pago->bindParam(':metodo_pago', $metodo_pago, PDO::PARAM_STR);
    $stmt_pago->bindParam(':estado', $estado, PDO::PARAM_STR);
    $stmt_pago->bindParam(':referencia', $referencia, PDO::PARAM_STR);
    $stmt_pago->bindParam(':fecha_pago', $fecha_pago_mysql, PDO::PARAM_STR);
    $stmt_pago->bindParam(':notas', $notas, PDO::PARAM_STR);
    
    if (!$stmt_pago->execute()) {
        throw new Exception("Error al insertar el pago.");
    }

    // 2. Si el pago está 'Completado', actualizar el estado de la cita
    if ($estado === 'Completado') {
        $query_update_cita = "
            UPDATE citas
            SET estado = 'Completada'
            WHERE id_cita = :id_cita_update
        ";
        $stmt_cita = $db->prepare($query_update_cita);
        $stmt_cita->bindParam(':id_cita_update', $id_cita, PDO::PARAM_INT);
        if (!$stmt_cita->execute()) {
            throw new Exception("Error al actualizar el estado de la cita.");
        }
    }

    // Confirmar la transacción
    $db->commit();

    echo json_encode(['success' => true, 'message' => 'Pago registrado y cita actualizada (si aplica) con éxito.']);

} catch (PDOException $e) {
    // Revertir la transacción si algo falla
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    error_log("Error PDO en registrar_pago.php: " . $e->getMessage());
    http_response_code(500); // Internal Server Error
    echo json_encode([
        'success' => false,
        'message' => 'Error de base de datos: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    // Revertir la transacción si algo falla
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    error_log("Error general en registrar_pago.php: " . $e->getMessage());
    http_response_code(400); // Bad Request o Internal Server Error según la naturaleza del error
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>