import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of, map } from 'rxjs';
import { AuthResponse, LoginResult } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = '/PATRONES-TA/public/api';
  
  // State management with Signals (Angular 18)
  currentUser = signal<AuthResponse | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    this.checkSession();
  }

  login(username: string, password: string): Observable<LoginResult> {
    return this.http.post<any>(`${this.API_URL}/auth/login`, { username, password }, { withCredentials: true }).pipe(
      map(response => {
        if (response.id_usuario) {
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
    this.http.post(`${this.API_URL}/auth/logout`, {}, { withCredentials: true }).subscribe({
      next: () => {
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
        this.router.navigate(['/login']);
      }
    });
  }

  checkSession(): void {
    this.http.get<AuthResponse>(`${this.API_URL}/auth/me`, { withCredentials: true }).subscribe({
      next: (user) => {
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      },
      error: () => {
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
      }
    });
  }

  hasRole(roles: number[]): boolean {
    const user = this.currentUser();
    return user ? roles.includes(user.id_rol) : false;
  }
}
