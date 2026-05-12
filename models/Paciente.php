<?php

require_once __DIR__ . '/Usuario.php';

/**
 * Paciente — Usuario del sistema
 */
class Paciente extends Usuario
{
    public function getPermisos(): array
    {
        return [
            'ver_mis_citas',
            'ver_mis_historiales',
            'ver_mis_pagos',
            'ver_mi_perfil',
            'editar_mi_perfil',
        ];
    }

    public function getDescripcion(): string
    {
        return 'Paciente de la clínica con acceso a sus citas e historiales.';
    }

    public function getIcono(): string
    {
        return '😊';
    }
}
