export interface Payment {
  id_pago: number;
  id_cita: number;
  monto: number;
  metodo_pago: string;
  estado: string;
  referencia: string | null;
  fecha_pago?: string;
  notas?: string;
  nombre_paciente?: string;
  nombre_tratamiento?: string;
  costo_tratamiento?: number;
  acumulado_historico?: number;
  saldo_historico?: number;
  monto_total_pagado?: number;
  saldo_restante?: number;
  historial_pagos?: Payment[];
}
