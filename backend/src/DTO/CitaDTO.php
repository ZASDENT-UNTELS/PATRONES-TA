<?php

namespace App\DTO;

use PDO;



/**
 * CitaDTO — Data Transfer Object para citas médicas
 *
 * ¿Qué es un DTO?
 *   Una clase simple que SOLO transporta datos entre capas.
 *   No tiene lógica de negocio, no toca la BD, no valida reglas.
 *   Su único trabajo: llevar los campos de una cita de un lado a otro
 *   de forma tipada y segura.
 *
 * Flujo de uso:
 *   Petición HTTP → Controller → CitaDTO → CitaService → CitaDAO → MySQL
 *                                                        ← CitaDTO ←
 *
 * Antes (sin DTO):
 *   Los datos viajaban como arrays $data['id_paciente'], $data['fecha_hora']
 *   Sin tipos, sin autocompletado, sin validación de estructura.
 *
 * Ahora (con DTO):
     *   $cita = new CitaDTO(id_paciente: 5, fecha_hora: '2025-08-01 10:00');
 *   $cita->idPaciente   ← tipado, autocompletado en el IDE
 */
class CitaDTO
{
    public function __construct(
        // ── Identificadores ───────────────────────────────────────────────
        public ?int    $id                  = null,  // null al crear, int al leer
        public ?int    $idPaciente          = null,
        public ?int    $idTratamiento       = null,
        public ?int    $idDentista          = null,
        public ?int    $creadoPor           = null,

        // ── Datos de la cita ──────────────────────────────────────────────
        public ?string $fechaHora           = null,  // 'YYYY-MM-DD HH:MM:SS'
        public int     $duracion            = 30,    // minutos
        public string  $estado              = 'Pendiente', // Pendiente|Confirmada|Cancelada|Completada
        public ?string $notas               = null,
        public int     $recordatorioEnviado = 0,
    ) {}

    /**
     * Crea un CitaDTO desde un array (resultado de PDO o petición HTTP).
     *
     * Uso:
     *   $dto = CitaDTO::fromArray($row);  // fila de BD
     */
    public static function fromArray(array $data): self
    {
        return new self(
            id:                  $data['id_cita']              ?? $data['id'] ?? null,
            idPaciente:          isset($data['id_paciente'])   ? (int) $data['id_paciente']   : null,
            idTratamiento:       isset($data['id_tratamiento']) ? (int) $data['id_tratamiento'] : null,
            idDentista:          isset($data['id_dentista'])   ? (int) $data['id_dentista']   : null,
            creadoPor:           isset($data['creado_por'])    ? (int) $data['creado_por']    : null,
            fechaHora:           $data['fecha_hora']           ?? null,
            duracion:            (int) ($data['duracion']      ?? 30),
            estado:              $data['estado']               ?? 'Pendiente',
            notas:               $data['notas']                ?? null,
            recordatorioEnviado: (int) ($data['recordatorio_enviado'] ?? 0),
        );
    }

    /**
     * Convierte el DTO a array para insertar/actualizar en la BD.
     *
     * Uso en CitaDAO:
     *   $stmt->execute($dto->toArray());
     */
    public function toArray(): array
    {
        return [
            'id_paciente'          => $this->idPaciente,
            'id_tratamiento'       => $this->idTratamiento,
            'id_dentista'          => $this->idDentista,
            'fecha_hora'           => $this->fechaHora,
            'duracion'             => $this->duracion,
            'estado'               => $this->estado,
            'notas'                => $this->notas,
            'recordatorio_enviado' => $this->recordatorioEnviado,
            'creado_por'           => $this->creadoPor,
        ];
    }
}
