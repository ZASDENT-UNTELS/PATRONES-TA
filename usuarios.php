<?php
/**
 * usuarios.php — Punto de entrada para la Vista de Usuarios (Factory Method)
 * 
 * Cumple con los criterios de aceptación:
 * - Vista en views/
 * - Lógica solo en models/
 * - Separación MVC estricta
 * - Usa UsuarioDAO::listar()
 */

define('ROOT_PATH', __DIR__);

// Requerir dependencias
require_once ROOT_PATH . '/vendor/autoload.php';
require_once ROOT_PATH . '/src/database/conexion.php';
require_once ROOT_PATH . '/src/controller/UsuarioController.php';

// Inicializar el controlador
$controller = new UsuarioController();

// El controlador usa UsuarioDAO::listar() y UsuarioFactory::crearMultiples() internamente
$datos = $controller->listar();

// Extraer variables para que la vista las consuma
$usuarios = $datos['usuarios'];
$usuarios_por_rol = $datos['usuarios_por_rol'];

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de Usuarios - Factory Method</title>
    <!-- Aquí se podrían incluir estilos globales -->
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f0f2f5;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        .btn-back {
            text-decoration: none;
            color: #2196f3;
            font-weight: 600;
        }
        .btn-back:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>

    <?php if (!isset($_GET['embed'])): ?>
    <div class="header">
        <h1>Sistema Zazdent</h1>
        <a href="dashboard.html" class="btn-back">&larr; Volver al Dashboard</a>
    </div>
    <?php endif; ?>

    <?php 
    // Incluir la vista de la lista de usuarios (Separación MVC estricta)
    require_once ROOT_PATH . '/views/usuarios_list.php'; 
    ?>

</body>
</html>
