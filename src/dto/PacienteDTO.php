<?php

/**
 * PacienteDTO — Data Transfer Object para pacientes
 *
 * Combina datos de dos tablas: `usuarios` (nombre, email, teléfono)
 * y `pacientes` (datos médicos: alergias, enfermedades, etc.)
 * porque en la UI siempre se muestran juntos.
 */
class PacienteDTO
{
    public function __construct(
        // ── Identificadores ───────────────────────────────────────────────
        public readonly ?int    $id              = null,  // id_paciente
        public readonly ?int    $idUsuario       = null,

        // ── Datos personales (tabla: usuarios) ────────────────────────────
        public readonly ?string $nombreApellido  = null,
        public readonly ?string $email           = null,
        public readonly ?string $telefono        = null,
        public readonly ?string $usuario         = null,

        // ── Datos médicos (tabla: pacientes) ──────────────────────────────
        public readonly ?string $fechaNacimiento      = null,  // 'YYYY-MM-DD'
        public readonly ?string $genero               = null,  // M|F|Otro
        public readonly ?string $alergias             = null,
        public readonly ?string $enfermedadesCronicas = null,
        public readonly ?string $medicamentos         = null,
        public readonly ?string $seguroMedico         = null,
        public readonly ?string $numeroSeguro         = null,
    ) {}

    /**
     * Crea un PacienteDTO desde un array (fila de BD o petición HTTP).
     */
    public static function fromArray(array $data): self
    {
        return new self(
            id:                   isset($data['id_paciente'])  ? (int) $data['id_paciente']  : null,
            idUsuario:            isset($data['id_usuario'])   ? (int) $data['id_usuario']   : null,
            nombreApellido:       $data['nombre_apellido']     ?? null,
            email:                $data['email']               ?? null,
            telefono:             $data['telefono']            ?? null,
            usuario:              $data['usuario_usuario']     ?? null,
            fechaNacimiento:      $data['fecha_nacimiento']    ?? null,
            genero:               $data['genero']              ?? null,
            alergias:             $data['alergias']            ?? null,
            enfermedadesCronicas: $data['enfermedades_cronicas'] ?? null,
            medicamentos:         $data['medicamentos']        ?? null,
            seguroMedico:         $data['seguro_medico']       ?? null,
            numeroSeguro:         $data['numero_seguro']       ?? null,
        );
    }

    /**
     * Solo los campos de la tabla `pacientes` (para INSERT/UPDATE).
     */
    public function toArrayPaciente(): array
    {
        return [
            'id_usuario'           => $this->idUsuario,
            'fecha_nacimiento'     => $this->fechaNacimiento,
            'genero'               => $this->genero,
            'alergias'             => $this->alergias,
            'enfermedades_cronicas'=> $this->enfermedadesCronicas,
            'medicamentos'         => $this->medicamentos,
            'seguro_medico'        => $this->seguroMedico,
            'numero_seguro'        => $this->numeroSeguro,
        ];
    }

    /**
     * Nombre completo para mostrar en vistas.
     */
    public function getNombreCompleto(): string
    {
        return $this->nombreApellido ?? 'Sin nombre';
    }
}
