<?php

namespace App\Models;

use App\Models\Usuario;




/**
 * Paciente — Usuario del sistema
 */
class Paciente extends Usuario
{
    private ?string $fechaNacimiento;
    private ?string $genero;
    private ?string $alergias;
    private ?string $enfermedadesCronicas;
    private ?string $seguroMedico;
    private ?string $numeroSeguro;

    public function __construct(array $datos)
    {
        parent::__construct($datos);
        $this->fechaNacimiento = $datos['fecha_nacimiento'] ?? null;
        $this->genero = $datos['genero'] ?? null;
        $this->alergias = $datos['alergias'] ?? null;
        $this->enfermedadesCronicas = $datos['enfermedades_cronicas'] ?? null;
        $this->seguroMedico = $datos['seguro_medico'] ?? null;
        $this->numeroSeguro = $datos['numero_seguro'] ?? null;
    }

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

    public function toArray(): array
    {
        $array = parent::toArray();
        $array['fecha_nacimiento'] = $this->fechaNacimiento;
        $array['genero'] = $this->genero;
        $array['alergias'] = $this->alergias;
        $array['enfermedades_cronicas'] = $this->enfermedadesCronicas;
        $array['seguro_medico'] = $this->seguroMedico;
        $array['numero_seguro'] = $this->numeroSeguro;
        return $array;
    }
}
