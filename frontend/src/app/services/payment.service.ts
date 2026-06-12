import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly API_URL = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.API_URL, { withCredentials: true });
  }

  registrarPago(data: any): Observable<any> {
    return this.http.post(this.API_URL, data, { withCredentials: true });
  }

  annulPayment(id: number): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}/anular`, {}, { withCredentials: true });
  }
}
