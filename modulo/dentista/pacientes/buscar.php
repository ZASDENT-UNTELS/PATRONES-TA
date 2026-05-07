<?php
require_once '../../../php/database/conexion.php';
session_start();

header('Content-Type: application/json');

// 1. Verificar autenticación y rol de dentista
if (!isset($_SESSION['id_usuario']) || $_SESSION['id_rol'] != 2) {
    http_response_code(401);
    echo json_encode(['error' => 'Acceso no autorizado. Se requiere rol de dentista.']);
    exit;
}

$id_usuario = $_SESSION['id_usuario'];

try {
    $db = new Database();
    $conn = $db->getConnection();

    // 2. Obtener el id_dentista asociado al usuario
    $stmt = $conn->prepare(
        "SELECT id_dentista FROM dentistas WHERE id_usuario = ?"
    );
    $stmt->execute([$id_usuario]);
    $dentista = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$dentista) {
        http_response_code(404);
        echo json_encode(['error' => 'No se encontró perfil de dentista asociado a este usuario']);
        exit;
    }

    // 3. Parámetros de búsqueda y paginación
    $searchTerm = isset($_GET['search']) ? "%{$_GET['search']}%" : '%';
    $pagina = isset($_GET['pagina']) ? max(1, (int)$_GET['pagina']) : 1;
    $porPagina = isset($_GET['por_pagina']) ? max(1, (int)$_GET['por_pagina']) : 25;
    $offset = ($pagina - 1) * $porPagina;

    // 4. Consulta para obtener pacientes del dentista (con los que tiene citas)
    $query = "
        SELECT SQL_CALC_FOUND_ROWS
            p.id_paciente, 
            u.nombre_apellido AS nombre, 
            u.telefono,
            u.email,
            p.fecha_nacimiento, 
            TIMESTAMPDIFF(YEAR, p.fecha_nacimiento, CURDATE()) AS edad, 
            p.genero, 
            p.alergias, 
            p.enfermedades_cronicas, 
            p.medicamentos, 
            p.seguro_medico, 
            p.numero_seguro,
            COUNT(c.id_cita) AS total_citas,
            MAX(c.fecha_hora) AS ultima_cita
        FROM pacientes p
        JOIN usuarios u ON p.id_usuario = u.id_usuario
        JOIN citas c ON p.id_paciente = c.id_paciente
        WHERE c.id_dentista = :id_dentista
          AND (u.nombre_apellido LIKE :search OR u.email LIKE :search)
        GROUP BY p.id_paciente
        ORDER BY ultima_cita DESC
        LIMIT :offset, :por_pagina
    ";

    $stmt = $conn->prepare($query);
    $stmt->bindParam(':id_dentista', $dentista['id_dentista'], PDO::PARAM_INT);
    $stmt->bindParam(':search', $searchTerm);
    $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
    $stmt->bindParam(':por_pagina', $porPagina, PDO::PARAM_INT);
    $stmt->execute();
    $pacientes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 5. Obtener total de pacientes para paginación
    $total = $conn->query("SELECT FOUND_ROWS()")->fetchColumn();

    // 6. Formatear fechas y datos sensibles
    foreach ($pacientes as &$paciente) {
        $paciente['fecha_nacimiento'] = $paciente['fecha_nacimiento'] ? date('d/m/Y', strtotime($paciente['fecha_nacimiento'])) : null;
        $paciente['ultima_cita'] = $paciente['ultima_cita'] ? date('d/m/Y H:i', strtotime($paciente['ultima_cita'])) : null;
        
        // Ocultar datos sensibles parcialmente
        if ($paciente['seguro_medico']) {
            $paciente['seguro_medico'] = substr($paciente['seguro_medico'], 0, 3) . '****';
        }
        if ($paciente['numero_seguro']) {
            $paciente['numero_seguro'] = substr($paciente['numero_seguro'], -4);
        }
    }

    // 7. Preparar respuesta con metadatos de paginación
    $response = [
        'success' => true,
        'data' => $pacientes,
        'meta' => [
            'total' => $total,
            'pagina_actual' => $pagina,
            'por_pagina' => $porPagina,
            'paginas_totales' => ceil($total / $porPagina),
            'dentista_id' => $dentista['id_dentista']
        ],
        'links' => [
            'primera' => "?pagina=1&por_pagina={$porPagina}".($searchTerm != '%' ? "&search={$_GET['search']}" : ""),
            'ultima' => "?pagina=".ceil($total / $porPagina)."&por_pagina={$porPagina}".($searchTerm != '%' ? "&search={$_GET['search']}" : ""),
            'siguiente' => $pagina < ceil($total / $porPagina) ? 
                "?pagina=".($pagina+1)."&por_pagina={$porPagina}".($searchTerm != '%' ? "&search={$_GET['search']}" : "") : null,
            'anterior' => $pagina > 1 ? 
                "?pagina=".($pagina-1)."&por_pagina={$porPagina}".($searchTerm != '%' ? "&search={$_GET['search']}" : "") : null
        ]
    ];

    echo json_encode($response, JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error en la base de datos',
        'detalles' => $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>