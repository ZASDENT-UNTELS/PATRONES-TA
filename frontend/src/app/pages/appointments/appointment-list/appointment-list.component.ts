import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LucideAngularModule } from 'lucide-angular';
import { AppointmentService } from '../../../services/appointment.service';
import { PaymentService } from '../../../services/payment.service';
import { AuthService } from '../../../services/auth.service';
import { Appointment } from '../../../models/appointment.model';
import { AppointmentFormDialogComponent } from '../appointment-form-dialog/appointment-form-dialog.component';
import { PaymentFormDialogComponent } from '../../payments/payment-form-dialog/payment-form-dialog.component';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    LucideAngularModule
  ],
  templateUrl: './appointment-list.component.html'
})
export class AppointmentListComponent implements OnInit {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  paginatedAppointments: Appointment[] = [];
  searchTerm = '';
  filterEstado = 'todas';
  filterFecha = 'todas';
  fechaInicio = '';
  fechaFin = '';

  isPatient = false;
  
  currentPage: number = 1;
  itemsPerPage: number = 10;
  
  loading = true;
  catalogos: any = { pacientes: [], dentistas: [], tratamientos: [] };

  constructor(
    private appointmentService: AppointmentService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    this.isPatient = this.authService.hasRole([4]);
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.loading = true;
    forkJoin({
      appointments: this.appointmentService.getAppointments(),
      pacientes: this.appointmentService.getPacientes(),
      dentistas: this.appointmentService.getDentistas(),
      tratamientos: this.appointmentService.getTratamientos()
    }).subscribe({
      next: (data) => {
        this.appointments = data.appointments;
        this.catalogos.pacientes = data.pacientes;
        this.catalogos.dentistas = data.dentistas;
        this.catalogos.tratamientos = data.tratamientos;
        this.applyFilterLogic();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading initial data', err);
        this.loading = false;
      }
    });
  }

  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
        this.applyFilterLogic();
      },
      error: (err) => console.error('Error loading appointments', err)
    });
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
    let filtered = [...this.appointments];
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    // Obtener final de la semana actual (Domingo)
    const currentDay = now.getDay(); 
    const daysToSunday = currentDay === 0 ? 0 : 7 - currentDay;
    const endOfWeek = new Date(now.getTime() + daysToSunday * 24 * 60 * 60 * 1000);
    const endOfWeekStr = endOfWeek.toISOString().split('T')[0];

    // 1. Filtro por Estado
    if (this.filterEstado === 'pendientes') {
      filtered = filtered.filter(a => ['programada', 'pendiente'].includes(a.estado.toLowerCase()));
    } else if (this.filterEstado === 'confirmadas') {
      filtered = filtered.filter(a => a.estado.toLowerCase() === 'confirmada');
    } else if (this.filterEstado === 'completadas') {
      filtered = filtered.filter(a => a.estado.toLowerCase() === 'completada');
    } else if (this.filterEstado === 'canceladas') {
      filtered = filtered.filter(a => a.estado.toLowerCase() === 'cancelada');
    }

    // 2. Filtro por Fecha
    if (this.filterFecha === 'hoy') {
      filtered = filtered.filter(a => a.fecha_hora && a.fecha_hora.startsWith(todayStr));
    } else if (this.filterFecha === 'semana') {
      filtered = filtered.filter(a => {
        if (!a.fecha_hora) return false;
        const dateStr = a.fecha_hora.split('T')[0];
        return dateStr >= todayStr && dateStr <= endOfWeekStr;
      });
    } else if (this.filterFecha === 'rango' && this.fechaInicio && this.fechaFin) {
      filtered = filtered.filter(a => {
        if (!a.fecha_hora) return false;
        const dateStr = a.fecha_hora.split('T')[0];
        return dateStr >= this.fechaInicio && dateStr <= this.fechaFin;
      });
    }

    // 3. Search text
    if (this.searchTerm) {
      filtered = filtered.filter(a => 
        a.nombre_paciente?.toLowerCase().includes(this.searchTerm) ||
        a.nombre_tratamiento?.toLowerCase().includes(this.searchTerm) ||
        a.nombre_dentista?.toLowerCase().includes(this.searchTerm)
      );
    }

    // Sort by priorities
    filtered.sort((a, b) => {
      if (!a.fecha_hora || !b.fecha_hora) return 0;
      const da = new Date(a.fecha_hora);
      const db = new Date(b.fecha_hora);
      
      const isTodayA = a.fecha_hora.startsWith(todayStr);
      const isTodayB = b.fecha_hora.startsWith(todayStr);
      const isFutureA = da >= new Date(todayStr) && !isTodayA;
      const isFutureB = db >= new Date(todayStr) && !isTodayB;

      const priorityA = isTodayA ? 1 : (isFutureA ? 2 : 3);
      const priorityB = isTodayB ? 1 : (isFutureB ? 2 : 3);

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      return (priorityA === 1 || priorityA === 2) ? da.getTime() - db.getTime() : db.getTime() - da.getTime();
    });

    this.filteredAppointments = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedAppointments = this.filteredAppointments.slice(start, end);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }
  
  get totalPages(): number {
    return Math.ceil(this.filteredAppointments.length / this.itemsPerPage) || 1;
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

  openAppointmentForm(): void {
    const dialogRef = this.dialog.open(AppointmentFormDialogComponent, {
      width: '640px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      panelClass: 'bootstrap-modal-container',
      disableClose: true,
      data: {
        mode: 'create',
        catalogos: this.catalogos
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const abonoInicial = Number(result.abono_inicial) || 0;
        const metodoPago = result.metodo_pago_inicial || 'Efectivo';
        delete result.abono_inicial;
        delete result.metodo_pago_inicial;

        this.appointmentService.createAppointment(result).subscribe({
          next: (response: any) => {
            if (abonoInicial > 0 && response.id) {
              const tratamientoObj = this.catalogos.tratamientos.find((t: any) => t.id_tratamiento === Number(result.id_tratamiento));
              const estadoAbono = (tratamientoObj && abonoInicial >= Number(tratamientoObj.precio)) ? 'Pagado' : 'Parcial';

              const pagoData = {
                id_cita: response.id,
                monto: abonoInicial,
                estado: estadoAbono,
                metodo_pago: metodoPago,
                fecha_pago: new Date().toISOString().split('T')[0]
              };
              
              this.paymentService.registrarPago(pagoData).subscribe({
                next: () => {
                  Swal.fire({
                    icon: 'success',
                    title: 'Cita y Abono Registrados',
                    text: 'La cita fue agendada y el abono inicial registrado correctamente.',
                    timer: 2000,
                    showConfirmButton: false
                  });
                  this.loadAppointments();
                }
              });
            } else {
              Swal.fire({
                icon: 'success',
                title: 'Cita Registrada',
                text: 'La nueva cita ha sido agendada con éxito.',
                timer: 2000,
                showConfirmButton: false
              });
              this.loadAppointments();
            }
          },
          error: (err) => {
            console.error('Error al registrar cita:', err);
            Swal.fire('Error', 'No se pudo crear la cita.', 'error');
          }
        });
      }
    });
  }

  openAppointmentDetail(cita: Appointment): void {
    // Para simplificar y seguir el mismo patrón de PaymentList, podemos reusar un componente de detalle
    // o el mismo AppointmentFormDialogComponent con mode: 'view'. 
    // Como crearemos un nuevo AppointmentDetailDialogComponent:
    import('../appointment-detail-dialog/appointment-detail-dialog.component').then(m => {
      this.dialog.open(m.AppointmentDetailDialogComponent, {
        width: '500px',
        panelClass: 'bootstrap-modal-container',
        data: { cita }
      });
    });
  }

  openPaymentForAppointment(cita: Appointment, autoComplete: boolean = false): void {
    // Buscar el tratamiento en los catálogos para obtener su precio
    const tratamientoObj = this.catalogos.tratamientos.find((t: any) => t.nombre === cita.nombre_tratamiento);
    const precioTratamiento = tratamientoObj ? Number(tratamientoObj.precio) : 0;

    const dialogRef = this.dialog.open(PaymentFormDialogComponent, {
      width: '640px',
      maxWidth: '95vw',
      panelClass: 'bootstrap-modal-container',
      disableClose: true,
      data: { 
        payment: {
          id_pago: cita.id_pago || undefined,
          id_cita: cita.id_cita,
          nombre_paciente: cita.nombre_paciente,
          nombre_tratamiento: cita.nombre_tratamiento,
          monto: cita.monto_pagado || 0, // Usa el monto pagado anterior, o 0 si es nuevo
          estado: cita.estado_pago || 'Pendiente'
        },
        totalReal: precioTratamiento // Total fijo del costo del tratamiento
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.paymentService.registrarPago(result).subscribe({
          next: () => {
            if (autoComplete) {
              this.appointmentService.updateStatus(cita.id_cita, 'Completada').subscribe({
                next: () => {
                  Swal.fire({
                    icon: 'success',
                    title: 'Cobrado y Completado',
                    text: 'El abono se registró y la cita fue marcada como Completada.',
                    timer: 2000,
                    showConfirmButton: false
                  });
                  this.loadAppointments();
                }
              });
            } else {
              Swal.fire({
                icon: 'success',
                title: 'Cobro Generado',
                text: 'El cobro ha sido enlazado a la cita correctamente.',
                timer: 2000,
                showConfirmButton: false
              });
              this.loadAppointments();
            }
          },
          error: (err) => {
            Swal.fire('Error', err.error?.error || 'No se pudo generar el cobro', 'error');
          }
        });
      }
    });
  }

  changeStatus(cita: Appointment, nuevoEstado: string): void {
    const tratamientoObj = this.catalogos.tratamientos.find((t: any) => t.nombre === cita.nombre_tratamiento);
    const precioTratamiento = tratamientoObj ? Number(tratamientoObj.precio) : 0;
    const montoPagado = Number(cita.monto_pagado || 0);

    // Interceptar "Completada" si hay saldo pendiente
    if (nuevoEstado.toLowerCase() === 'completada' && montoPagado < precioTratamiento) {
      const saldo = precioTratamiento - montoPagado;
      Swal.fire({
        title: 'Saldo Pendiente',
        html: `Aún hay un saldo pendiente de <b>S/. ${saldo.toFixed(2)}</b>.<br><br>¿Deseas registrar el cobro automáticamente y completar la cita?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        customClass: {
          confirmButton: 'btn btn-primary px-4',
          cancelButton: 'btn btn-light px-4'
        },
        buttonsStyling: false
      }).then((result) => {
        if (result.isConfirmed) {
          this.autoPayAndComplete(cita, saldo);
        }
      });
      return;
    }

    let extraWarning = '';
    if (nuevoEstado.toLowerCase() === 'cancelada' && montoPagado > 0) {
      extraWarning = `<br><br><span class="text-danger fw-bold">⚠️ ¡Atención! Los S/. ${montoPagado.toFixed(2)} abonados serán reembolsados automáticamente.</span>`;
    }

    Swal.fire({
      title: '¿Cambiar estado?',
      html: `Cambiar cita #${cita.id_cita} a "<b>${nuevoEstado}</b>"${extraWarning}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'btn btn-primary px-4',
        cancelButton: 'btn btn-light px-4'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.executeChangeStatus(cita, nuevoEstado);
      }
    });
  }

  private executeChangeStatus(cita: Appointment, nuevoEstado: string): void {
    this.appointmentService.updateStatus(cita.id_cita, nuevoEstado).subscribe({
      next: () => {
        Swal.fire({
          title: 'Actualizado',
          text: `Estado cambiado a "${nuevoEstado}"`,
          icon: 'success',
          customClass: {
            confirmButton: 'btn btn-primary px-4'
          },
          buttonsStyling: false
        });
        this.loadAppointments();
      },
      error: (err) => {
        const msg = err.error?.error || 'No se pudo cambiar el estado';
        Swal.fire('Error', msg, 'error');
      }
    });
  }

  private autoPayAndComplete(cita: Appointment, monto: number): void {
    const pagoData = {
      id_cita: cita.id_cita,
      monto: monto,
      estado: 'Pagado',
      metodo_pago: 'Efectivo', // Por defecto cuando es automático
      fecha_pago: new Date().toISOString().split('T')[0]
    };

    this.paymentService.registrarPago(pagoData).subscribe({
      next: () => {
        this.appointmentService.updateStatus(cita.id_cita, 'Completada').subscribe({
          next: () => {
            Swal.fire({
              title: 'Cobrado y Completado',
              text: `Se registró el pago automático de S/. ${monto.toFixed(2)} y se completó la cita.`,
              icon: 'success',
              customClass: {
                confirmButton: 'btn btn-primary px-4'
              },
              buttonsStyling: false
            });
            this.loadAppointments();
          },
          error: (err) => {
            Swal.fire('Error', 'Se registró el cobro pero no se pudo completar la cita.', 'error');
            this.loadAppointments();
          }
        });
      },
      error: (err) => {
        Swal.fire('Error', err.error?.error || 'No se pudo generar el cobro automático', 'error');
      }
    });
  }

  deleteAppointment(cita: Appointment): void {
    Swal.fire({
      title: '¿Eliminar cita?',
      text: `Vas a eliminar la cita #${cita.id_cita} de ${cita.nombre_paciente}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'btn btn-danger px-4',
        cancelButton: 'btn btn-light px-4'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.appointmentService.deleteAppointment(cita.id_cita).subscribe({
          next: () => {
            Swal.fire({
              title: 'Eliminada',
              text: 'La cita ha sido eliminada',
              icon: 'success',
              customClass: {
                confirmButton: 'btn btn-primary px-4'
              },
              buttonsStyling: false
            });
            this.loadAppointments();
          },
          error: (err) => {
            const msg = err.error?.error || 'No se pudo eliminar';
            Swal.fire('Error', msg, 'error');
          }
        });
      }
    });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  formatTime(dateStr: string): string {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  }

  isToday(dateStr: string): boolean {
    if (!dateStr) return false;
    const todayStr = new Date().toISOString().split('T')[0];
    return dateStr.startsWith(todayStr);
  }

  isPastUnattended(cita: Appointment): boolean {
    if (!cita.fecha_hora || cita.estado.toLowerCase() === 'completada' || cita.estado.toLowerCase() === 'cancelada') return false;
    const todayStr = new Date().toISOString().split('T')[0];
    return new Date(cita.fecha_hora) < new Date(todayStr);
  }
}
