<?php
/**
 * Layout base para correos electrónicos.
 *
 * Variables esperadas:
 * @var string $content Contenido principal renderizado por la plantilla interna.
 * @var string $titulo Título de la sección o cabecera.
 */
?>
<h2><?= htmlspecialchars($titulo ?? 'Notificación - ZAZDENT') ?></h2>
<?= $content ?>
<br>
<p>Saludos cordiales,<br>El equipo de ZAZDENT</p>
