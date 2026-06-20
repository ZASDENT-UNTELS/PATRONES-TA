<?php
/**
 * Plantilla para la confirmación de solicitud de cita.
 *
 * Variables esperadas:
 * @var string $nombrePaciente Nombre completo del paciente
 * @var array $datosCita Datos de la cita (tratamiento, fecha_hora)
 */
?>
<p>Hola <strong><?= htmlspecialchars($nombrePaciente) ?></strong>,</p>
<p>Hemos recibido tu solicitud de cita para el tratamiento de <strong><?= htmlspecialchars($datosCita['tratamiento'] ?? 'Odontología General') ?></strong>.</p>
<p><strong>Fecha solicitada:</strong> <?= htmlspecialchars($datosCita['fecha_hora']) ?></p>
<p>Nos pondremos en contacto contigo pronto para confirmar.</p>
