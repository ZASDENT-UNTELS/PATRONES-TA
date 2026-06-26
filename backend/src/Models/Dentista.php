<?php

namespace App\Models;

use App\Models\Usuario;




/**
 * Dentista — Personal odontológico
 */
class Dentista extends Usuario
{
    private ?int $idEspecialidad;
    private ?string $cedulaProfesional;
    private ?string $biografia;
    private ?int $experiencia;
    private ?string $horario;
    private ?string $foto;

    public function __construct(array $datos)
    {
        parent::__construct($datos);
        $this->idEspecialidad = isset($datos['id_especialidad']) ? (int)$datos['id_especialidad'] : null;
        $this->cedulaProfesional = $datos['cedula_profesional'] ?? null;
        $this->biografia = $datos['biografia'] ?? null;
        $this->experiencia = isset($datos['experiencia']) ? (int)$datos['experiencia'] : null;
        $this->horario = $datos['horario'] ?? null;
        $this->foto = $datos['foto'] ?? null;
    }

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

    public function toArray(): array
    {
        $array = parent::toArray();
        $array['id_especialidad'] = $this->idEspecialidad;
        $array['cedula_profesional'] = $this->cedulaProfesional;
        $array['biografia'] = $this->biografia;
        $array['experiencia'] = $this->experiencia;
        $array['horario'] = $this->horario;
        $array['foto'] = $this->foto;
        return $array;
    }
}
