export interface User {
  id_usuario: number;
  nombre_apellido: string;
  usuario_usuario: string;
  email: string;
  telefono?: string;
  direccion?: string;
  id_rol: number;
  nombre_rol: string;
  activo: boolean;
  ultimo_login?: string;
  
  // Optional Patient specific fields
  fecha_nacimiento?: string;
  genero?: string;
  alergias?: string;
  enfermedades_cronicas?: string;
  seguro_medico?: string;
  numero_seguro?: string;
  
  // Optional Dentist specific fields
  id_especialidad?: number;
  cedula_profesional?: string;
  biografia?: string;
  experiencia?: number;
  horario?: string;
  foto?: string;
}

export interface AuthResponse {
  id_usuario: number;
  nombre: string;
  rol: string;
  id_rol: number;
  username: string;
}

export interface LoginResult {
  success: boolean;
  message?: string;
  user?: AuthResponse;
}
