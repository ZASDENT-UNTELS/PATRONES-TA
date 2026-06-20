<?php

namespace App\Views;

use RuntimeException;

/**
 * Clase TemplateView — Implementación del patrón de diseño Template View.
 * Separar la presentación de la lógica de negocio/controlador.
 */
class TemplateView
{
    private string $templatePath;
    private array $data;
    private ?string $layoutPath = null;

    /**
     * Constructor.
     *
     * @param string $templatePath Ruta absoluta o relativa al archivo de la vista.
     * @param array $data Variables que se inyectarán en la plantilla.
     */
    public function __construct(string $templatePath, array $data = [])
    {
        $this->templatePath = $templatePath;
        $this->data = $data;
    }

    /**
     * Asignar un layout contenedor para envolver la vista actual.
     *
     * @param string $layoutPath Ruta al archivo del layout.
     * @return self
     */
    public function setLayout(string $layoutPath): self
    {
        $this->layoutPath = $layoutPath;
        return $this;
    }

    /**
     * Renderizar la plantilla e inyectar el contenido en el layout si existe.
     *
     * @return string
     * @throws RuntimeException
     */
    public function render(): string
    {
        if (!file_exists($this->templatePath)) {
            throw new RuntimeException("Plantilla no encontrada: " . $this->templatePath);
        }

        // Extraer variables en el scope local del archivo a incluir
        extract($this->data);

        // Iniciar captura de buffer para la plantilla principal
        ob_start();
        include $this->templatePath;
        $content = ob_get_clean();

        // Si se definió un layout, inyectar el contenido del template dentro del layout
        if ($this->layoutPath) {
            if (!file_exists($this->layoutPath)) {
                throw new RuntimeException("Layout no encontrado: " . $this->layoutPath);
            }

            ob_start();
            include $this->layoutPath;
            return ob_get_clean();
        }

        return $content;
    }
}
