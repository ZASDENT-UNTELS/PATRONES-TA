import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { PaymentService } from '../../../services/payment.service';
import { AuthService } from '../../../services/auth.service';
import { Payment } from '../../../models/payment.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PaymentFormDialogComponent } from '../payment-form-dialog/payment-form-dialog.component';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    LucideAngularModule
  ],
  templateUrl: './payment-list.component.html'
})
export class PaymentListComponent implements OnInit {
  payments: Payment[] = [];
  filteredPayments: Payment[] = [];
  paginatedPayments: Payment[] = [];
  searchTerm: string = '';
  
  // Filtros
  filterEstado = 'todos';
  filterFecha = 'todos';
  fechaInicio = '';
  fechaFin = '';

  isPatient = false;
  loading = true;

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;

  // Dashboard Stats
  totalCobrado: number = 0;
  pagosPendientes: number = 0;
  pagosVencidos: number = 0;
  promedioCita: number = 0;

  constructor(
    private paymentService: PaymentService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    this.isPatient = this.authService.hasRole([4]);
  }

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.loading = true;
    this.paymentService.getPayments().subscribe({
      next: (data) => {
        // Pre-procesar datos para calcular saldos históricos (Ledger)
        this.payments = this.calculateLedgerBalances(data);
        this.calculateStats(data);
        this.applyFilterLogic();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading payments', err);
        this.loading = false;
      }
    });
  }

  // Agrupa por id_cita y consolida los abonos para la vista principal
  private calculateLedgerBalances(payments: any[]): any[] {
    const citasGroups = new Map<number, any[]>();
    
    // Agrupar pagos por cita
    payments.forEach(p => {
      if (!citasGroups.has(p.id_cita)) citasGroups.set(p.id_cita, []);
      citasGroups.get(p.id_cita)?.push(p);
    });

    const result: any[] = [];

    // Calcular por cada cita
    citasGroups.forEach(group => {
      // Ordenar del más antiguo al más reciente
      group.sort((a, b) => new Date(a.fecha_pago || 0).getTime() - new Date(b.fecha_pago || 0).getTime());
      
      let acumulado = 0;
      let tienePagosValidos = false;
      let todosAnulados = true;

      group.forEach(p => {
        const st = p.estado?.toLowerCase() || '';
        const isAnulado = st === 'anulado' || st === 'reembolsado';
        if (!isAnulado) {
          acumulado += Number(p.monto) || 0;
          tienePagosValidos = true;
          todosAnulados = false;
        }
        
        const totalTratamiento = Number(p.costo_tratamiento || p.monto);
        p.acumulado_historico = acumulado;
        p.saldo_historico = totalTratamiento - acumulado;
        if (p.saldo_historico < 0) p.saldo_historico = 0;
      });

      // El estado final es el del último pago o recalculado
      const lastPayment = group[group.length - 1];
      const totalTratamiento = Number(lastPayment.costo_tratamiento || lastPayment.monto);
      
      let finalEstado = 'Pendiente';
      if (lastPayment.estado_cita?.toLowerCase() === 'cancelada') {
        finalEstado = 'Anulado';
      } else if (todosAnulados && group.length > 0) {
        finalEstado = 'Anulado';
      } else {
        finalEstado = acumulado >= totalTratamiento ? 'Pagado' : (acumulado > 0 ? 'Parcial' : 'Pendiente');
      }
      
      const consolidated = {
        ...lastPayment, // Hereda id_cita, nombre_paciente, nombre_tratamiento, etc.
        monto_total_pagado: acumulado,
        saldo_restante: totalTratamiento - acumulado < 0 ? 0 : totalTratamiento - acumulado,
        historial_pagos: group,
        // Forzamos el estado real basado en el saldo final o anulaciones
        estado: finalEstado,
        // Fechas para filtros (usamos la del último abono)
        fecha_pago: lastPayment.fecha_pago
      };

      result.push(consolidated);
    });

    // Devolver el array final ordenado de más reciente a más antiguo (para la tabla)
    return result.sort((a, b) => new Date(b.fecha_pago || 0).getTime() - new Date(a.fecha_pago || 0).getTime());
  }

  applyFilter(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.applyFilterLogic();
  }

  onCustomDateChange(): void {
    if (this.fechaInicio && this.fechaFin) {
      if (this.fechaFin < this.fechaInicio) {
        this.fechaFin = this.fechaInicio;
      }
      this.filterFecha = 'rango';
      this.applyFilterLogic();
    }
  }

  applyFilterLogic(): void {
    let filtered = [...this.payments];
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // 1. Filtro por Estado
    if (this.filterEstado === 'pagados') {
      filtered = filtered.filter(p => p.estado?.toLowerCase() === 'pagado');
    } else if (this.filterEstado === 'pendientes') {
      filtered = filtered.filter(p => ['pendiente', 'parcial'].includes(p.estado?.toLowerCase() || ''));
    } else if (this.filterEstado === 'anulados') {
      filtered = filtered.filter(p => p.estado?.toLowerCase() === 'anulado');
    }

    // 2. Filtro por Fecha
    if (this.filterFecha !== 'todos') {
      filtered = filtered.filter(p => {
        if (!p.fecha_pago) return false;
        
        const dateStr = p.fecha_pago.split(' ')[0].split('T')[0];
        if (this.filterFecha === 'hoy') {
          return dateStr === todayStr;
        } else if (this.filterFecha === 'mes' || this.filterFecha === 'mes_anterior') {
          const [y, m, d] = dateStr.split('-');
          const pYear = parseInt(y, 10);
          const pMonth = parseInt(m, 10) - 1;
          
          if (this.filterFecha === 'mes') {
            return pYear === currentYear && pMonth === currentMonth;
          } else {
            const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
            return pYear === lastMonthYear && pMonth === lastMonth;
          }
        } else if (this.filterFecha === 'rango' && this.fechaInicio && this.fechaFin) {
          return dateStr >= this.fechaInicio && dateStr <= this.fechaFin;
        }
        return true;
      });
    }

    // 3. Búsqueda de Texto
    if (this.searchTerm) {
      filtered = filtered.filter(p => 
        p.nombre_paciente?.toLowerCase().includes(this.searchTerm) ||
        p.nombre_tratamiento?.toLowerCase().includes(this.searchTerm) ||
        (p.referencia && p.referencia.toLowerCase().includes(this.searchTerm))
      );
    }
    
    // Sort logic (pendientes/vencidos first, then date DESC)
    filtered.sort((a, b) => {
      const isUrgentA = ['Pendiente', 'Vencido'].includes(a.estado);
      const isUrgentB = ['Pendiente', 'Vencido'].includes(b.estado);
      if (isUrgentA && !isUrgentB) return -1;
      if (!isUrgentA && isUrgentB) return 1;
      
      const da = new Date(a.fecha_pago || 0).getTime();
      const db = new Date(b.fecha_pago || 0).getTime();
      return db - da; // DESC
    });

    this.filteredPayments = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedPayments = this.filteredPayments.slice(start, end);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }
  
  get totalPages(): number {
    return Math.ceil(this.filteredPayments.length / this.itemsPerPage) || 1;
  }
  
  getPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }
  
  changeItemsPerPage(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.itemsPerPage = Number(value);
    this.currentPage = 1;
    this.updatePagination();
  }

  calculateStats(rawPayments: any[]): void {
    let totalCobradoMes = 0;
    let sumHistorico = 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // 1. Total Cobrado (Mes) y Suma Histórica (desde rawPayments)
    rawPayments.forEach(p => {
      const estado = p.estado?.toLowerCase() || '';
      let isCurrentMonth = false;

      if (p.fecha_pago) {
        const dateStr = p.fecha_pago.split(' ')[0].split('T')[0];
        const [yearStr, monthStr] = dateStr.split('-');
        const pYear = parseInt(yearStr, 10);
        const pMonth = parseInt(monthStr, 10) - 1; // 0-indexed
        
        isCurrentMonth = (pMonth === currentMonth && pYear === currentYear);
      }
      
      const montoNum = Number(p.monto) || 0;

      if (estado !== 'anulado' && estado !== 'reembolsado' && montoNum > 0) {
        if (isCurrentMonth) {
          totalCobradoMes += montoNum;
        }
        sumHistorico += montoNum;
      }
    });

    // 2. Pendientes, Vencidos, y Promedio por cita (desde this.payments consolidados)
    let pendientesCount = 0;
    let vencidosCount = 0;
    let countCitas = this.payments.length;

    const today = new Date(currentYear, currentMonth, now.getDate()).getTime();

    this.payments.forEach(c => {
      const estado = c.estado?.toLowerCase() || '';
      
      if (estado === 'pendiente' || estado === 'parcial') {
        pendientesCount++;
        
        let paymentTime = 0;
        if (c.fecha_pago) {
          const dateStr = c.fecha_pago.split(' ')[0].split('T')[0];
          const [yearStr, monthStr, dayStr] = dateStr.split('-');
          paymentTime = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, parseInt(dayStr, 10)).getTime();
        }

        if (paymentTime < today) {
          vencidosCount++;
        }
      }
    });

    this.totalCobrado = totalCobradoMes;
    this.pagosPendientes = pendientesCount;
    this.pagosVencidos = vencidosCount;
    this.promedioCita = countCitas > 0 ? sumHistorico / countCitas : 0;
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
      confirmButtonText: 'Sí, anular',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'btn btn-danger px-4',
        cancelButton: 'btn btn-light px-4'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.paymentService.annulPayment(pago.id_pago).subscribe({
          next: () => {
            Swal.fire({
              title: 'Anulado',
              text: 'El pago ha sido anulado correctamente',
              icon: 'success',
              customClass: {
                confirmButton: 'btn btn-primary px-4'
              },
              buttonsStyling: false
            });
            this.loadPayments();
          },
          error: (err) => Swal.fire('Error', err.error?.error || 'No se pudo anular el pago', 'error')
        });
      }
    });
  }

  formatDate(dateStr: string | undefined | null): string {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  formatMonto(monto: number | undefined | null): string {
    return `S/. ${Number(monto || 0).toFixed(2)}`;
  }

  openPaymentForm(payment?: Payment): void {
    const dialogRef = this.dialog.open(PaymentFormDialogComponent, {
      width: '640px',
      maxWidth: '95vw',
      panelClass: 'bootstrap-modal-container',
      disableClose: true,
      data: { payment: payment || null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (!result.id_cita) {
          Swal.fire('Error', 'No se puede registrar un pago sin asociarlo a una cita.', 'error');
          return;
        }
        
        this.paymentService.registrarPago(result).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Pago Registrado',
              text: 'El pago ha sido procesado correctamente.',
              timer: 2000,
              showConfirmButton: false
            });
            this.loadPayments();
          },
          error: (err) => {
            Swal.fire('Error', err.error?.error || 'No se pudo registrar el pago', 'error');
          }
        });
      }
    });
  }
}
