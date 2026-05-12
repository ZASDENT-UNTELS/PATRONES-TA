export interface Payment {
  id_pago: number;
  id_cita: number;
  monto: number;
  metodo_pago: string;
  estado: string;
  referencia: string | null;
  fecha_pago: string;
  notas: string | null;
  nombre_paciente: string;
  nombre_tratamiento: string;
}
