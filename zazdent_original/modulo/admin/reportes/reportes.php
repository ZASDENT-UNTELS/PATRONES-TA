<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reportes</title>
    <!-- Enlace a Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<script>
    let tiempoInactivo = 0;

    // Aumenta el contador cada segundo
    const inactividad = setInterval(() => {
        tiempoInactivo++;
        if (tiempoInactivo >= 60) { // 300 segundos = 5 minutos
            clearInterval(inactividad);
            fetch('../bienvenido/logout.php') // Ajusta si está en otra ruta
                .then(() => {
                    document.body.innerHTML = `
                        <div style="
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
                            color: white;
                            font-family: Arial, sans-serif;
                            text-align: center;
                            padding: 20px;
                            animation: fadeIn 1s ease-in-out;
                        ">
                            <div style="background: rgba(0,0,0,0.4); padding: 40px 30px; border-radius: 15px; box-shadow: 0 8px 25px rgba(0,0,0,0.2);">
                                <h2 style="font-size: 28px; margin-bottom: 15px;">⏳ Sesión cerrada por inactividad</h2>
                                <p style="font-size: 18px;">Serás redirigido al inicio de sesión en unos segundos...</p>
                            </div>
                        </div>
                        <style>
                            @keyframes fadeIn {
                                from { opacity: 0; }
                                to { opacity: 1; }
                            }
                        </style>
                    `;
                    setTimeout(() => {
                        window.location.href = '../bienvenido/login.php';
                    }, 3000); // redirige después de 3 segundos
                });
        }
    }, 1000); // cada segundo

    // Reiniciar contador de inactividad al detectar movimiento o actividad
    const resetTiempo = () => { tiempoInactivo = 0; };
    window.addEventListener("mousemove", resetTiempo);
    window.addEventListener("keydown", resetTiempo);
    window.addEventListener("mousedown", resetTiempo);
    window.addEventListener("scroll", resetTiempo);
</script>

<body class="bg-primary text-white"> <!-- Aquí se añade el fondo azul y texto blanco para mejorar la visibilidad -->
    <div class="container mt-5">
        <h2 class="text-center mb-4">Reportes</h2>
        <div class="d-flex flex-column align-items-center gap-3">
            <a href="reporte_citas.php" class="btn btn-light">Reporte Citas</a>
            <a href="reporte_pacientes.php" class="btn btn-light">Reporte Pacientes</a>
            <a href="reporte_pagos.php" class="btn btn-light">Reporte Pagos</a>
            <a href="reporte_tratamientos.php" class="btn btn-light">Reporte Tratamientos</a>
        </div>
    </div>
    <!-- Script de Bootstrap para interactividad -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>