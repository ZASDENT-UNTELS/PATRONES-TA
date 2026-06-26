import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LucideAngularModule } from 'lucide-angular';
import { Appointment } from '../../../models/appointment.model';

export interface AppointmentDetailDialogData {
  cita: Appointment;
}

@Component({
  selector: 'app-appointment-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule
  ],
  template: `
    <div class="modal-content border-0">
      <!-- Header -->
      <div class="modal-header border-bottom-0 p-4 pb-0">
        <div class="d-flex align-items-center gap-3">
          <div class="bg-primary bg-opacity-10 text-primary p-2 rounded-3">
            <lucide-icon name="info" [size]="24"></lucide-icon>
          </div>
          <div>
            <h5 class="modal-title fw-bold mb-0">Detalle de la Cita</h5>
            <p class="text-muted small mb-0">Información en modo de solo lectura</p>
          </div>
        </div>
        <button type="button" class="btn-close shadow-none" (click)="dialogRef.close()"></button>
      </div>

      <!-- Body -->
      <div class="modal-body p-4">
        <div class="card bg-light border-0 mb-3">
          <div class="card-body">
            <h6 class="fw-bold text-dark mb-3">Participantes</h6>
            <div class="row g-3">
              <div class="col-6">
                <span class="text-muted small fw-bold d-block">Paciente</span>
                <span class="fw-medium text-dark">{{ cita.nombre_paciente || '—' }}</span>
              </div>
              <div class="col-6">
                <span class="text-muted small fw-bold d-block">Doctor</span>
                <span class="fw-medium text-dark">{{ cita.nombre_dentista || '—' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="card bg-light border-0 mb-3">
          <div class="card-body">
            <h6 class="fw-bold text-dark mb-3">Horario y Tipo</h6>
            <div class="row g-3">
              <div class="col-6">
                <span class="text-muted small fw-bold d-block">Fecha</span>
                <span class="fw-medium text-dark">{{ formatDate(cita.fecha_hora) }}</span>
              </div>
              <div class="col-6">
                <span class="text-muted small fw-bold d-block">Hora</span>
                <span class="fw-medium text-primary">{{ formatTime(cita.fecha_hora) }}</span>
              </div>
              <div class="col-12">
                <span class="text-muted small fw-bold d-block">Tratamiento / Servicio</span>
                <span class="fw-medium text-dark">{{ cita.nombre_tratamiento || '—' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="card bg-light border-0">
          <div class="card-body">
            <h6 class="fw-bold text-dark mb-3">Estado y Notas</h6>
            <div class="mb-3">
              <span class="text-muted small fw-bold d-block mb-1">Estado Actual</span>
              <span class="badge rounded-pill fw-bold px-3 py-2"
                    [ngStyle]="{
                      'background-color': (cita.estado === 'Pendiente' || cita.estado === 'Programada') ? '#FEF9C3' : 
                                          (cita.estado === 'Confirmada' ? '#DBEAFE' : 
                                          (cita.estado === 'Completada' ? '#DCFCE7' : 
                                          (cita.estado === 'Cancelada' ? '#FEE2E2' : '#F3F4F6'))),
                      'color': (cita.estado === 'Pendiente' || cita.estado === 'Programada') ? '#713F12' : 
                               (cita.estado === 'Confirmada' ? '#1E3A5F' : 
                               (cita.estado === 'Completada' ? '#166534' : 
                               (cita.estado === 'Cancelada' ? '#991B1B' : '#374151')))
                    }">
                {{ cita.estado || '—' }}
              </span>
            </div>
            <div>
              <span class="text-muted small fw-bold d-block">Notas adicionales</span>
              <p class="mb-0 text-dark small" style="white-space: pre-wrap;">{{ cita.notas || 'Sin notas registradas.' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="modal-footer border-top-0 p-4 pt-0">
        <button type="button" class="btn btn-light px-4 fw-bold text-muted border w-100" (click)="dialogRef.close()">
          Cerrar
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; border-radius: 12px; overflow: hidden; }
  `]
})
export class AppointmentDetailDialogComponent {
  cita: Appointment;

  constructor(
    public dialogRef: MatDialogRef<AppointmentDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AppointmentDetailDialogData
  ) {
    this.cita = data.cita;
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  formatTime(dateStr?: string): string {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  }
}
