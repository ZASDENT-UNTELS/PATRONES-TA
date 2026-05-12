<?php

require_once __DIR__ . '/Usuario.php';

/**
 * Dentista — Personal odontológico
 */
class Dentista extends Usuario
{
    public function getPermisos(): array
    {
        return [
            'ver_citas',
            'crear_citas',
            'editar_citas',
            'ver_pacientes',
            'ver_historiales',
            'crear_historiales',
            'editar_historiales',
            'ver_mis_datos',
        ];
    }

    public function getDescripcion(): string
    {
        return 'Personal odontológico con acceso a citas e historiales médicos.';
    }

    public function getIcono(): string
    {
        return '👨‍⚕️';
    }
}
