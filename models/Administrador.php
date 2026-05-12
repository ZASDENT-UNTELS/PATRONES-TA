<?php

require_once __DIR__ . '/Usuario.php';

/**
 * Administrador — Rol con acceso completo al sistema
 */
class Administrador extends Usuario
{
    public function getPermisos(): array
    {
        return [
            'crear_usuarios',
            'editar_usuarios',
            'eliminar_usuarios',
            'ver_reportes',
            'configurar_sistema',
            'gestionar_roles',
            'acceso_auditoria',
            'gestionar_citas',
            'gestionar_pacientes',
            'gestionar_dentistas',
            'gestionar_pagos',
        ];
    }

    public function getDescripcion(): string
    {
        return 'Administrador del sistema con acceso completo a todas las funcionalidades.';
    }

    public function getIcono(): string
    {
        return '👤';
    }
}
