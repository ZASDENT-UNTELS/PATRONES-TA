<?php

/**
 * Front Controller — ZAZDENT API
 */

define('ROOT_PATH', dirname(__DIR__));

require_once ROOT_PATH . '/vendor/autoload.php';

// Deshabilitar salida de errores en HTML para no romper las respuestas JSON
ini_set('display_errors', '0');
ini_set('log_errors', '1');

// Iniciar sesión temprano para evitar warnings de "headers already sent"
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

use App\Http\FrontController;

// CORS y entrada del Front Controller se manejan dentro de la clase
$frontController = new FrontController();
$frontController->dispatch();
