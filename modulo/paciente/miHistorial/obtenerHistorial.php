<?php
require_once '../../../php/database/conexion.php';
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['id_usuario']) || $_SESSION['id_rol'] != 4) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit();
}

try {
    global $db;
    $conn = $db;
    $id_usuario = $_SESSION['id_usuario'];

    // PRIMERO: Obtener id_paciente basado en id_usuario
    $sqlPaciente = "SELECT id_paciente FROM pacientes WHERE id_usuario = :id_usuario";
    $stmtPaciente = $conn->prepare($sqlPaciente);
    $stmtPaciente->bindParam(':id_usuario', $id_usuario);
    $stmtPaciente->execute();
    
    $paciente = $stmtPaciente->fetch(PDO::FETCH_ASSOC);
    
    if (!$paciente) {
        echo json_encode(['success' => false, 'message' => 'Paciente no encontrado']);
        exit();
    }
    
    $id_paciente = $paciente['id_paciente'];

    // SEGUNDO: Obtener historial usando id_paciente
    $sql = "SELECT 
        h.id_historial,
        h.fecha_procedimiento,
        h.diagnostico,
        h.procedimiento,
        h.observaciones,
        h.receta,
        h.proxima_visita,
        h.adjuntos,
        t.nombre AS tratamiento,
        u.nombre_apellido AS dentista
    FROM historial_medico h
    LEFT JOIN tratamientos t ON h.id_tratamiento = t.id_tratamiento
    LEFT JOIN dentistas d ON h.id_dentista = d.id_dentista
    LEFT JOIN usuarios u ON d.id_usuario = u.id_usuario
    WHERE h.id_paciente = :id_paciente";
             
    $params = [':id_paciente' => $id_paciente];
    $whereClauses = [];


    // --- Filtering logic ---
    if (isset($_GET['search']) && $_GET['search'] !== '') {
        $searchTerm = '%' . $_GET['search'] . '%';
        $whereClauses[] = "(h.diagnostico LIKE :search_term OR h.procedimiento LIKE :search_term OR t.nombre LIKE :search_term OR u.nombre_apellido LIKE :search_term)";
        $params[':search_term'] = $searchTerm;
    }

    if (isset($_GET['date_filter']) && $_GET['date_filter'] !== '') {
        $currentDate = new DateTime();
        $startDate = null;
        switch ($_GET['date_filter']) {
            case 'ultimo_mes':
                $startDate = (new DateTime())->modify('-1 month')->format('Y-m-d 00:00:00');
                break;
            case 'ultimos_6_meses':
                $startDate = (new DateTime())->modify('-6 months')->format('Y-m-d 00:00:00');
                break;
            case 'ultimo_ano':
                $startDate = (new DateTime())->modify('-1 year')->format('Y-m-d 00:00:00');
                break;
            case '2_anos':
                $startDate = (new DateTime())->modify('-2 years')->format('Y-m-d 00:00:00');
                break;
            // Add more cases as needed
        }
        if ($startDate) {
            $whereClauses[] = "h.fecha_procedimiento >= :start_date";
            $params[':start_date'] = $startDate;
        }
    }

    // Append WHERE clauses if any filters are applied
    if (!empty($whereClauses)) {
        $sql .= " AND " . implode(" AND ", $whereClauses);
    }
    // --- End filtering logic ---

    $sql .= " ORDER BY h.fecha_procedimiento DESC LIMIT 0, 50;"; // Limit to 50 records for performance, adjust as needed.
             
    $stmt = $conn->prepare($sql);

    // Bind parameters dynamically
    foreach ($params as $key => &$val) {
        $stmt->bindParam($key, $val);
    }
    unset($val); // Unset reference after loop to avoid issues

    $stmt->execute();

    $historial = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Check for JSON encoding errors before sending
    $json_output = json_encode(['success' => true, 'data' => $historial]);
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log("Error JSON encoding historial: " . json_last_error_msg());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error al codificar datos para el historial.']);
        exit();
    }

    echo $json_output;

} catch (PDOException $e) {
    http_response_code(500);
    error_log("Error de base de datos en obtenerHistorial.php: " . $e->getMessage()); // Log the error
    echo json_encode(['success' => false, 'message' => 'Error de base de datos. Por favor, intente más tarde.']);
} catch (Exception $e) {
    http_response_code(500);
    error_log("Error general en obtenerHistorial.php: " . $e->getMessage()); // Log the error
    echo json_encode(['success' => false, 'message' => 'Error interno del servidor.']);
}
?>