<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

// Ajusta esta ruta a la ubicación real de tu conexion.php
require_once __DIR__ . '/../../../../php/database/conexion.php'; 

try {
    $database = new Database();
    $db = $database->getConnection();

    if (!isset($db) || !$db instanceof PDO) {
        throw new Exception("Error: La conexión a la base de datos no está disponible.");
    }

    // Obtener y decodificar el cuerpo JSON de la solicitud
    $data = json_decode(file_get_contents('php://input'), true);

    // Validar campos obligatorios
    $required_fields = ['id_pago', 'id_cita', 'monto', 'metodo_pago', 'estado', 'fecha_pago'];
    foreach ($required_fields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            http_response_code(400); // Bad Request
            echo json_encode(['success' => false, 'message' => "El campo '$field' es obligatorio."]);
            exit();
        }
    }

    // Limpiar y sanitizar datos
    $id_pago = filter_var($data['id_pago'], FILTER_VALIDATE_INT);
    $id_cita = filter_var($data['id_cita'], FILTER_VALIDATE_INT); // Se usa para actualizar la cita
    $monto = filter_var($data['monto'], FILTER_VALIDATE_FLOAT);
    $metodo_pago = filter_var($data['metodo_pago'], FILTER_SANITIZE_STRING);
    $estado = filter_var($data['estado'], FILTER_SANITIZE_STRING);
    $referencia = filter_var($data['referencia'] ?? null, FILTER_SANITIZE_STRING);
    $fecha_pago = filter_var($data['fecha_pago'], FILTER_SANITIZE_STRING);
    $notas = filter_var($data['notas'] ?? null, FILTER_SANITIZE_STRING);

    // Validación adicional de tipos y valores
    if ($id_pago === false || $id_cita === false || $monto === false || $monto < 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Datos de entrada inválidos para ID de pago, ID de cita o monto.']);
        exit();
    }
    // Asegurarse de que fecha_pago tiene el formato correcto para MySQL
    $fecha_pago_mysql = str_replace('T', ' ', $fecha_pago) . ':00'; // Convierte 'YYYY-MM-DDTHH:MM' a 'YYYY-MM-DD HH:MM:00'

    // Iniciar transacción
    $db->beginTransaction();

    // 1. Actualizar el pago
    $query_update_pago = "
        UPDATE pagos
        SET 
            monto = :monto,
            metodo_pago = :metodo_pago,
            estado = :estado,
            referencia = :referencia,
            fecha_pago = :fecha_pago,
            notas = :notas
        WHERE id_pago = :id_pago
    ";
    $stmt_pago = $db->prepare($query_update_pago);
    $stmt_pago->bindParam(':monto', $monto, PDO::PARAM_STR);
    $stmt_pago->bindParam(':metodo_pago', $metodo_pago, PDO::PARAM_STR);
    $stmt_pago->bindParam(':estado', $estado, PDO::PARAM_STR);
    $stmt_pago->bindParam(':referencia', $referencia, PDO::PARAM_STR);
    $stmt_pago->bindParam(':fecha_pago', $fecha_pago_mysql, PDO::PARAM_STR);
    $stmt_pago->bindParam(':notas', $notas, PDO::PARAM_STR);
    $stmt_pago->bindParam(':id_pago', $id_pago, PDO::PARAM_INT);
    
    if (!$stmt_pago->execute()) {
        throw new Exception("Error al actualizar el pago.");
    }

    // 2. Lógica para actualizar el estado de la cita si el pago se 'Completado' o 'Reembolsado'
    // Primero, obtener el estado actual de la cita antes de cualquier cambio.
    $query_get_cita_estado = "SELECT estado FROM citas WHERE id_cita = :id_cita";
    $stmt_get_cita_estado = $db->prepare($query_get_cita_estado);
    $stmt_get_cita_estado->bindParam(':id_cita', $id_cita, PDO::PARAM_INT);
    $stmt_get_cita_estado->execute();
    $current_cita_estado_row = $stmt_get_cita_estado->fetch(PDO::FETCH_ASSOC);
    $current_cita_estado = $current_cita_estado_row ? $current_cita_estado_row['estado'] : null;

    $new_cita_estado = null;
    if ($estado === 'Completado' && $current_cita_estado !== 'Completada') {
        $new_cita_estado = 'Completada';
    } elseif ($estado === 'Reembolsado' && $current_cita_estado !== 'Reembolsado') {
        // Podrías tener un estado 'Reembolsada' para citas o revertir a 'Pendiente'
        // Para este ejemplo, si se reembolsa el pago, podríamos considerar la cita 'Pendiente' de nuevo o agregar 'Reembolsada'
        // Voy a asumir que un pago reembolsado deja la cita como "Pendiente" si no hay otros pagos, o "Reembolsada"
        $new_cita_estado = 'Pendiente'; // O 'Reembolsada' si la agregas a tu enum de citas
    } elseif ($estado === 'Cancelado' && $current_cita_estado !== 'Cancelada') {
        $new_cita_estado = 'Cancelada';
    }


    if ($new_cita_estado) {
        $query_update_cita = "
            UPDATE citas
            SET estado = :new_cita_estado
            WHERE id_cita = :id_cita_update
        ";
        $stmt_cita = $db->prepare($query_update_cita);
        $stmt_cita->bindParam(':new_cita_estado', $new_cita_estado, PDO::PARAM_STR);
        $stmt_cita->bindParam(':id_cita_update', $id_cita, PDO::PARAM_INT);
        if (!$stmt_cita->execute()) {
            throw new Exception("Error al actualizar el estado de la cita.");
        }
    }

    // Confirmar la transacción
    $db->commit();

    echo json_encode(['success' => true, 'message' => 'Pago actualizado y cita actualizada (si aplica) con éxito.']);

} catch (PDOException $e) {
    // Revertir la transacción si algo falla
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    error_log("Error PDO en actualizar_pago.php: " . $e->getMessage());
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
    error_log("Error general en actualizar_pago.php: " . $e->getMessage());
    http_response_code(400); // Bad Request o Internal Server Error según la naturaleza del error
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>