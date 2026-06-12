<?php

namespace App\Services;

use Exception;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

/**
 * CorreoService — Service Layer para el envío de correos
 *
 * Centraliza la lógica de envío de emails para toda la aplicación.
 * Toma las credenciales desde el archivo .env por seguridad.
 */
class CorreoService
{
    private PHPMailer $mail;

    public function __construct()
    {
        $this->mail = new PHPMailer(true);
        $this->mail->isSMTP();
        $this->mail->Host       = $_ENV['SMTP_HOST'] ?? 'smtp.gmail.com';
        $this->mail->SMTPAuth   = true;
        $this->mail->Username   = $_ENV['SMTP_USER'] ?? 'tu-correo@gmail.com';
        $this->mail->Password   = $_ENV['SMTP_PASS'] ?? 'tu-contraseña';
        $this->mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $this->mail->Port       = $_ENV['SMTP_PORT'] ?? 587;
        $this->mail->CharSet    = 'UTF-8';

        $this->mail->setFrom(
            $_ENV['SMTP_USER'] ?? 'tu-correo@gmail.com', 
            'Clínica ZAZDENT'
        );
    }

    /**
     * Enviar correo de confirmación de cita
     * 
     * @param string $destinatario Correo electrónico del paciente
     * @param string $nombrePaciente Nombre del paciente
     * @param array $datosCita Datos adicionales (fecha, tratamiento, etc.)
     */
    public function enviarConfirmacionCita(string $destinatario, string $nombrePaciente, array $datosCita): bool
    {
        try {
            $this->mail->clearAddresses(); // Limpiar destinatarios previos por si se reusa la instancia
            $this->mail->addAddress($destinatario, $nombrePaciente);

            $this->mail->Subject = 'Confirmación de solicitud de cita - ZAZDENT';
            
            $cuerpoHTML = "<h2>Nueva solicitud de cita</h2>
                <p>Hola <strong>" . htmlspecialchars($nombrePaciente) . "</strong>,</p>
                <p>Hemos recibido tu solicitud de cita para el tratamiento de <strong>" . htmlspecialchars($datosCita['tratamiento'] ?? 'Odontología General') . "</strong>.</p>
                <p><strong>Fecha solicitada:</strong> " . htmlspecialchars($datosCita['fecha_hora']) . "</p>
                <p>Nos pondremos en contacto contigo pronto para confirmar.</p>
                <br>
                <p>Saludos cordiales,<br>El equipo de ZAZDENT</p>";
            
            $this->mail->isHTML(true);
            $this->mail->Body = $cuerpoHTML;
            $this->mail->AltBody = strip_tags(str_replace("<br>", "\n", $cuerpoHTML));

            $this->mail->send();
            return true;
        } catch (Exception $e) {
            error_log('Error al enviar correo de confirmación: ' . $e->getMessage());
            return false;
        }
    }
}
