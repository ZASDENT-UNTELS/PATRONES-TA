<?php

/**
 * PagoDTO — Data Transfer Object para pagos
 */
class PagoDTO
{
    public function __construct(
        // ── Identificadores ───────────────────────────────────────────────
        public readonly ?int    $id          = null,
        public readonly ?int    $idCita      = null,

        // ── Datos del pago ────────────────────────────────────────────────
        public readonly ?float  $monto       = null,
        public readonly ?string $metodoPago  = null,  // Efectivo|Tarjeta|Transferencia|Yape|Plin
        public readonly string  $estado      = 'Pendiente', // Pendiente|Pagado|Anulado
        public readonly ?string $referencia  = null,  // número de operación, voucher, etc.
        public readonly ?string $fechaPago   = null,  // 'YYYY-MM-DD HH:MM:SS'
        public readonly ?string $notas       = null,
    ) {}

    /**
     * Crea un PagoDTO desde un array (fila de BD o petición HTTP).
     */
    public static function fromArray(array $data): self
    {
        return new self(
            id:         isset($data['id_pago']) ? (int) $data['id_pago'] : null,
            idCita:     isset($data['id_cita']) ? (int) $data['id_cita'] : null,
            monto:      isset($data['monto'])   ? (float) $data['monto'] : null,
            metodoPago: $data['metodo_pago']    ?? null,
            estado:     $data['estado']         ?? 'Pendiente',
            referencia: $data['referencia']     ?? null,
            fechaPago:  $data['fecha_pago']     ?? null,
            notas:      $data['notas']          ?? null,
        );
    }

    /**
     * Convierte a array para INSERT/UPDATE en la BD.
     */
    public function toArray(): array
    {
        return [
            'id_cita'     => $this->idCita,
            'monto'       => $this->monto,
            'metodo_pago' => $this->metodoPago,
            'estado'      => $this->estado,
            'referencia'  => $this->referencia,
            'fecha_pago'  => $this->fechaPago,
            'notas'       => $this->notas,
        ];
    }

    /**
     * Monto formateado para mostrar en vistas (ej: S/ 150.00)
     */
    public function getMontoFormateado(): string
    {
        return 'S/ ' . number_format($this->monto ?? 0, 2);
    }
}
