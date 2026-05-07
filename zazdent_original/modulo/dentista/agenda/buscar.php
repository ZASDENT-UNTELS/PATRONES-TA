<?php
require_once '../../../php/database/conexion.php';
session_start();

header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['id_usuario'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized access']);
    exit;
}

// Get filter parameters
$estado = $_GET['estado'] ?? '';
$dentistaId = $_GET['dentista'] ?? '';
$fechaInicio = $_GET['fecha_inicio'] ?? '';
$fechaFin = $_GET['fecha_fin'] ?? '';

try {
    $db = new Database();
    $conn = $db->getConnection();

    // Base query with joins
    $query = "
        SELECT 
            c.id_cita,
            u_p.nombre_apellido AS paciente,
            t.nombre AS tratamiento,
            IFNULL(u_d.nombre_apellido, 'No asignado') AS dentista,
            DATE_FORMAT(c.fecha_hora, '%Y-%m-%d %H:%i') AS fecha_hora,
            c.duracion,
            c.estado,
            c.notas
        FROM citas c
        LEFT JOIN pacientes p ON c.id_paciente = p.id_paciente
        LEFT JOIN usuarios u_p ON p.id_usuario = u_p.id_usuario
        LEFT JOIN tratamientos t ON c.id_tratamiento = t.id_tratamiento
        LEFT JOIN dentistas d ON c.id_dentista = d.id_dentista
        LEFT JOIN usuarios u_d ON d.id_usuario = u_d.id_usuario
        WHERE 1=1
    ";

    $params = [];

    // Role-based filtering
    switch ($_SESSION['id_rol']) {
        case 1: // Admin - can see all appointments
            break;
            
        case 2: // Dentist - can only see their own appointments
            // Get dentist ID from user ID
            $stmt = $conn->prepare("SELECT id_dentista FROM dentistas WHERE id_usuario = ?");
            $stmt->execute([$_SESSION['id_usuario']]);
            $dentista = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($dentista) {
                $query .= " AND c.id_dentista = :dentista_id";
                $params[':dentista_id'] = $dentista['id_dentista'];
            }
            break;
            
        case 3: // Receptionist - can see all appointments but can't modify certain ones
            break;
            
        case 4: // Patient - can only see their own appointments
            // Get patient ID from user ID
            $stmt = $conn->prepare("SELECT id_paciente FROM pacientes WHERE id_usuario = ?");
            $stmt->execute([$_SESSION['id_usuario']]);
            $paciente = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($paciente) {
                $query .= " AND c.id_paciente = :paciente_id";
                $params[':paciente_id'] = $paciente['id_paciente'];
            }
            break;
            
        default:
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden - Invalid role']);
            exit;
    }

    // Additional filters
    if (!empty($estado)) {
        $query .= " AND c.estado = :estado";
        $params[':estado'] = $estado;
    }

    if (!empty($dentistaId) && ($_SESSION['id_rol'] == 1 || $_SESSION['id_rol'] == 3)) {
        $query .= " AND d.id_dentista = :dentista";
        $params[':dentista'] = $dentistaId;
    }

    if (!empty($fechaInicio)) {
        $query .= " AND DATE(c.fecha_hora) >= :fechaInicio";
        $params[':fechaInicio'] = $fechaInicio;
    }
    
    if (!empty($fechaFin)) {
        $query .= " AND DATE(c.fecha_hora) <= :fechaFin";
        $params[':fechaFin'] = $fechaFin;
    }

    $query .= " ORDER BY c.fecha_hora DESC";

    // Execute query
    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    $citas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Format dates and other fields if needed
    foreach ($citas as &$cita) {
        $cita['fecha_formateada'] = date('d/m/Y H:i', strtotime($cita['fecha_hora']));
    }

    echo json_encode(['data' => $citas]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>