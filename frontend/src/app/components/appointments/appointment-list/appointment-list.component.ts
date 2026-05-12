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
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LucideAngularModule } from 'lucide-angular';
import { AppointmentService } from '../../../services/appointment.service';
import { Appointment } from '../../../models/appointment.model';
import { AppointmentFormDialogComponent } from '../appointment-form-dialog/appointment-form-dialog.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-appointment-list',
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
    MatMenuModule,
    MatDialogModule,
    LucideAngularModule
  ],
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css']
})
export class AppointmentListComponent implements OnInit {
  displayedColumns: string[] = ['id_cita', 'nombre_paciente', 'nombre_tratamiento', 'nombre_dentista', 'fecha_hora', 'duracion', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<Appointment>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private appointmentService: AppointmentService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => console.error('Error loading appointments', err)
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
      case 'pendiente': return 'estado-pendiente';
      case 'confirmada': return 'estado-confirmada';
      case 'completada': return 'estado-completada';
      case 'cancelada': return 'estado-cancelada';
      default: return '';
    }
  }

  openAppointmentForm(): void {
    const dialogRef = this.dialog.open(AppointmentFormDialogComponent, {
      width: '640px',
      disableClose: true,
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.appointmentService.createAppointment(result).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: '¡Cita creada!',
              text: 'La cita ha sido programada correctamente.',
              timer: 2000,
              showConfirmButton: false
            });
            this.loadAppointments();
          },
          error: (err) => {
            const msg = err.error?.error || 'No se pudo crear la cita.';
            Swal.fire('Error', msg, 'error');
          }
        });
      }
    });
  }

  changeStatus(cita: Appointment, nuevoEstado: string): void {
    Swal.fire({
      title: '¿Cambiar estado?',
      text: `Cambiar cita #${cita.id_cita} a "${nuevoEstado}"`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#1E88E5',
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.appointmentService.updateStatus(cita.id_cita, nuevoEstado).subscribe({
          next: () => {
            Swal.fire('Actualizado', `Estado cambiado a "${nuevoEstado}"`, 'success');
            this.loadAppointments();
          },
          error: (err) => {
            const msg = err.error?.error || 'No se pudo cambiar el estado';
            Swal.fire('Error', msg, 'error');
          }
        });
      }
    });
  }

  deleteAppointment(cita: Appointment): void {
    Swal.fire({
      title: '¿Eliminar cita?',
      text: `Vas a eliminar la cita #${cita.id_cita} de ${cita.nombre_paciente}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.appointmentService.deleteAppointment(cita.id_cita).subscribe({
          next: () => {
            Swal.fire('Eliminada', 'La cita ha sido eliminada', 'success');
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
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
}
