import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private readonly API_URL = `${environment.apiUrl}/appointments`;

  constructor(private http: HttpClient) {}

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.API_URL, { withCredentials: true });
  }

  createAppointment(data: any): Observable<any> {
    return this.http.post(this.API_URL, data, { withCredentials: true });
  }

  updateStatus(id: number, estado: string): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}/status`, { estado }, { withCredentials: true });
  }

  deleteAppointment(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`, { withCredentials: true });
  }

  // Helper endpoints for form dropdowns
  getCatalogos(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/catalogos`, { withCredentials: true });
  }

  getPacientes(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/pacientes`, { withCredentials: true });
  }

  getDentistas(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/dentistas`, { withCredentials: true });
  }

  getTratamientos(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/tratamientos`, { withCredentials: true });
  }
}
