<?php

require_once __DIR__ . '/Usuario.php';

/**
 * Recepcionista — Personal administrativo
 */
class Recepcionista extends Usuario
{
    public function getPermisos(): array
    {
        return [
            'ver_citas',
            'crear_citas',
            'editar_citas',
            'ver_pacientes',
            'crear_pacientes',
            'editar_pacientes',
            'registrar_pagos',
            'ver_mis_datos',
        ];
    }

    public function getDescripcion(): string
    {
        return 'Personal administrativo encargado de citas, pacientes y pagos.';
    }

    public function getIcono(): string
    {
        return '👩‍💼';
    }
}
