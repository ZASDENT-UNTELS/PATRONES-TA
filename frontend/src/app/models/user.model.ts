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
