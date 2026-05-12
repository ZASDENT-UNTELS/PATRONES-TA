export interface Appointment {
  id_cita: number;
  fecha_hora: string;
  duracion: number;
  estado: string;
  notas: string | null;
  nombre_paciente: string;
  nombre_tratamiento: string;
  nombre_dentista: string | null;
}
