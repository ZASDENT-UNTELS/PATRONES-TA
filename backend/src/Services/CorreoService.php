<?php

namespace App\Services;

use App\Views\TemplateView;
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
            
            // Usar patrón Template View para separar el diseño HTML del correo
            $templatePath = dirname(__DIR__) . '/Views/emails/confirmacion_cita.php';
            $layoutPath = dirname(__DIR__) . '/Views/layouts/mail_layout.php';

            $view = new TemplateView($templatePath, [
                'nombrePaciente' => $nombrePaciente,
                'datosCita'      => $datosCita,
                'titulo'         => 'Nueva solicitud de cita'
            ]);
            $view->setLayout($layoutPath);
            $cuerpoHTML = $view->render();
            
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
