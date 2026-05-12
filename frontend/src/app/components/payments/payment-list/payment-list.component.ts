import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LucideAngularModule } from 'lucide-angular';
import { PaymentService } from '../../../services/payment.service';
import { Payment } from '../../../models/payment.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    LucideAngularModule
  ],
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.css']
})
export class PaymentListComponent implements OnInit {
  displayedColumns: string[] = ['id_pago', 'nombre_paciente', 'nombre_tratamiento', 'monto', 'metodo_pago', 'fecha_pago', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<Payment>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.paymentService.getPayments().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => console.error('Error loading payments', err)
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getEstadoClass(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'pagado': return 'estado-pagado';
      case 'pendiente': return 'estado-pendiente';
      case 'anulado': return 'estado-anulado';
      default: return '';
    }
  }

  getMetodoIcon(metodo: string): string {
    switch (metodo?.toLowerCase()) {
      case 'efectivo': return '💵';
      case 'tarjeta': return '💳';
      case 'transferencia': return '🏦';
      case 'yape': return '📱';
      case 'plin': return '📲';
      default: return '💰';
    }
  }

  annulPayment(pago: Payment): void {
    Swal.fire({
      title: '¿Anular pago?',
      text: `Vas a anular el pago #${pago.id_pago} de S/. ${pago.monto}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Sí, anular',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.paymentService.annulPayment(pago.id_pago).subscribe({
          next: () => {
            Swal.fire('Anulado', 'El pago ha sido anulado correctamente', 'success');
            this.loadPayments();
          },
          error: (err) => Swal.fire('Error', err.error?.error || 'No se pudo anular el pago', 'error')
        });
      }
    });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  formatMonto(monto: number): string {
    return `S/. ${Number(monto).toFixed(2)}`;
  }
}
