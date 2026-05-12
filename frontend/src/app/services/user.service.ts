import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = '/PATRONES-TA/public/api/usuarios';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.API_URL, { withCredentials: true });
  }

  registerUser(userData: any): Observable<any> {
    return this.http.post(this.API_URL, userData, { withCredentials: true });
  }

  updateUser(id: number, userData: any): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, userData, { withCredentials: true });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`, { withCredentials: true });
  }
}
