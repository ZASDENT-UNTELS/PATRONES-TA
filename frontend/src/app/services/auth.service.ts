import { environment } from '../../environments/environment';
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, of, map } from 'rxjs';
import { AuthResponse, LoginResult } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  
  // State management with Signals (Angular 18)
  currentUser = signal<AuthResponse | null>(null);
  isAuthenticated = signal<boolean>(false);
  verificacionCompleta = signal<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    // Ya no llamamos a checkSession() aquí. Se hará mediante APP_INITIALIZER.
  }

  verificarSesion(): Observable<boolean> {
    const savedUser = localStorage.getItem('auth_user');
    
    // Si no hay datos guardados, evitamos llamar al backend innecesariamente
    if (!savedUser) {
      this.currentUser.set(null);
      this.isAuthenticated.set(false);
      this.verificacionCompleta.set(true);
      return of(false);
    }

    // Verificamos si la cookie de sesión en el backend sigue viva
    return this.http.get<AuthResponse>(`${this.API_URL}/auth/me`, { withCredentials: true }).pipe(
      map(user => {
        localStorage.setItem('auth_user', JSON.stringify(user));
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
        this.verificacionCompleta.set(true);
        return true;
      }),
      catchError(() => {
        localStorage.removeItem('auth_user');
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
        this.verificacionCompleta.set(true);
        return of(false);
      })
    );
  }

  login(username: string, password: string): Observable<LoginResult> {
    return this.http.post<any>(`${this.API_URL}/auth/login`, { username, password }, { withCredentials: true }).pipe(
      map(response => {
        if (response.id_usuario) {
          localStorage.setItem('auth_user', JSON.stringify(response));
          this.currentUser.set(response);
          this.isAuthenticated.set(true);
          return { success: true, user: response };
        }
        return { success: false, message: 'Credenciales inválidas' };
      }),
      catchError(err => {
        console.error('Login error', err);
        return of({ success: false, message: err.error?.error || 'Error al iniciar sesión' });
      })
    );
  }

  logout(): void {
    // Hacemos el logout asíncrono, pero limpiamos estado de inmediato
    this.http.post(`${this.API_URL}/auth/logout`, {}, { withCredentials: true }).subscribe();
    
    localStorage.removeItem('auth_user');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  hasRole(roles: number[]): boolean {
    const user = this.currentUser();
    return user ? roles.includes(user.id_rol) : false;
  }
}
