import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly API_URL = '/PATRONES-TA/public/api/pagos';

  constructor(private http: HttpClient) {}

  getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.API_URL, { withCredentials: true });
  }

  annulPayment(id: number): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}/anular`, {}, { withCredentials: true });
  }
}
