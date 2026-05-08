<?php

/**
 * HistorialMedicoDTO — Data Transfer Object para historial médico
 */
class HistorialMedicoDTO
{
    public function __construct(
        // ── Identificadores ───────────────────────────────────────────────
        public readonly ?int    $id                 = null,
        public readonly ?int    $idPaciente         = null,
        public readonly ?int    $idDentista         = null,
        public readonly ?int    $idTratamiento      = null,

        // ── Datos del procedimiento ───────────────────────────────────────
        public readonly ?string $fechaProcedimiento = null,  // 'YYYY-MM-DD HH:MM:SS'
        public readonly ?string $diagnostico        = null,
        public readonly ?string $procedimiento      = null,
        public readonly ?string $observaciones      = null,
        public readonly ?string $receta             = null,
        public readonly ?string $proximaVisita      = null,  // 'YYYY-MM-DD'
    ) {}

    /**
     * Crea un HistorialMedicoDTO desde un array (fila de BD o petición HTTP).
     */
    public static function fromArray(array $data): self
    {
        return new self(
            id:                 isset($data['id_historial'])     ? (int) $data['id_historial']  : null,
            idPaciente:         isset($data['id_paciente'])      ? (int) $data['id_paciente']   : null,
            idDentista:         isset($data['id_dentista'])      ? (int) $data['id_dentista']   : null,
            idTratamiento:      isset($data['id_tratamiento'])   ? (int) $data['id_tratamiento']: null,
            fechaProcedimiento: $data['fecha_procedimiento']     ?? null,
            diagnostico:        $data['diagnostico']             ?? null,
            procedimiento:      $data['procedimiento']           ?? null,
            observaciones:      $data['observaciones']           ?? null,
            receta:             $data['receta']                  ?? null,
            proximaVisita:      $data['proxima_visita']          ?? null,
        );
    }

    /**
     * Convierte a array para INSERT/UPDATE en la BD.
     */
    public function toArray(): array
    {
        return [
            'id_paciente'         => $this->idPaciente,
            'id_dentista'         => $this->idDentista,
            'id_tratamiento'      => $this->idTratamiento,
            'fecha_procedimiento' => $this->fechaProcedimiento,
            'diagnostico'         => $this->diagnostico,
            'procedimiento'       => $this->procedimiento,
            'observaciones'       => $this->observaciones,
            'receta'              => $this->receta,
            'proxima_visita'      => $this->proximaVisita,
        ];
    }
}
