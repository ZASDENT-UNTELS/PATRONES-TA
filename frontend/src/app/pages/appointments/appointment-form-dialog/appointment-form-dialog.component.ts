import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { LucideAngularModule } from 'lucide-angular';
import { AppointmentService } from '../../../services/appointment.service';
import { UserService } from '../../../services/user.service';
import { UserFormDialogComponent } from '../../users/user-form-dialog/user-form-dialog.component';
import { forkJoin } from 'rxjs';

export interface AppointmentFormDialogData {
  mode: 'create';
  catalogos?: {
    pacientes: any[];
    dentistas: any[];
    tratamientos: any[];
  };
}

@Component({
  selector: 'app-appointment-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule
  ],
  template: `
    <div class="modal-content border-0">
      <!-- Header -->
      <div class="modal-header border-bottom-0 p-4 pb-0">
        <div class="d-flex align-items-center gap-3">
          <div class="bg-primary bg-opacity-10 text-primary p-2 rounded-3">
            <lucide-icon name="calendar" [size]="24"></lucide-icon>
          </div>
          <div>
            <h5 class="modal-title fw-bold mb-0">Programar Cita</h5>
            <p class="text-muted small mb-0">Complete la información para agendar la atención</p>
          </div>
        </div>
        <button type="button" class="btn-close shadow-none" (click)="dialogRef.close()"></button>
      </div>

      <!-- Body -->
      <div class="modal-body p-4 custom-scrollbar">
        <!-- Removed Loading state since data is prefetched -->

        <!-- Form -->
        <form [formGroup]="form">
          <!-- Section: Patient -->
          <div class="mb-4">
            <div class="d-flex align-items-center gap-2 mb-3">
              <span class="fw-bold text-primary small text-uppercase tracking-wider">01. Información del Paciente</span>
              <hr class="flex-grow-1 opacity-10">
            </div>
            
            <div class="mb-0">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <label class="form-label small fw-bold text-dark mb-0">Seleccionar Paciente</label>
                <button type="button" class="btn btn-sm btn-link text-primary p-0 text-decoration-none d-flex align-items-center" 
                        [class.opacity-50]="form.get('id_paciente')?.value"
                        [disabled]="form.get('id_paciente')?.value"
                        (click)="openNewPatientDialog()">
                  <lucide-icon name="plus" [size]="14" class="me-1"></lucide-icon>Nuevo Paciente
                </button>
              </div>
              <select class="form-select py-2 shadow-none" formControlName="id_paciente"
                      [class.is-invalid]="form.get('id_paciente')?.invalid && form.get('id_paciente')?.touched">
                <option [value]="null" disabled>Elegir un paciente...</option>
                <option *ngFor="let p of pacientes" [value]="p.id_paciente || p.id">
                  {{ p.nombreApellido || p.nombre }}
                </option>
              </select>
              <div class="invalid-feedback">El paciente es obligatorio</div>
            </div>
          </div>

          <!-- Section: Treatment -->
          <div class="mb-4">
            <div class="d-flex align-items-center gap-2 mb-3">
              <span class="fw-bold text-primary small text-uppercase tracking-wider">02. Servicio y Profesional</span>
              <hr class="flex-grow-1 opacity-10">
            </div>
            
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label small fw-bold text-dark">Tratamiento</label>
                <select class="form-select py-2 shadow-none" formControlName="id_tratamiento" 
                        (change)="onTratamientoChange()"
                        [class.is-invalid]="form.get('id_tratamiento')?.invalid && form.get('id_tratamiento')?.touched">
                  <option [value]="null" disabled>Elegir tratamiento...</option>
                  <option *ngFor="let t of tratamientos" [value]="t.id_tratamiento">
                    {{ t.nombre }} — S/. {{ t.precio }}
                  </option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-bold text-dark">Dentista Asignado</label>
                <select class="form-select py-2 shadow-none" formControlName="id_dentista">
                  <option [value]="null">Sin asignar (Auto)</option>
                  <option *ngFor="let d of dentistas" [value]="d.id_dentista">
                    {{ d.nombre }} {{ d.especialidad ? '(' + d.especialidad + ')' : '' }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Section: Schedule -->
          <div class="mb-4">
            <div class="d-flex align-items-center gap-2 mb-3">
              <span class="fw-bold text-primary small text-uppercase tracking-wider">03. Fecha y Duración</span>
              <hr class="flex-grow-1 opacity-10">
            </div>
            
            <div class="row g-3">
              <div class="col-md-4">
                <label class="form-label small fw-bold text-dark">Fecha</label>
                <input type="date" class="form-control py-2 shadow-none" 
                       formControlName="fecha" [min]="minDate"
                       [class.is-invalid]="form.get('fecha')?.invalid && form.get('fecha')?.touched">
              </div>
              <div class="col-md-3">
                <label class="form-label small fw-bold text-dark">Hora</label>
                <input type="time" class="form-control py-2 shadow-none" 
                       formControlName="hora"
                       [class.is-invalid]="form.get('hora')?.invalid && form.get('hora')?.touched">
              </div>
              <div class="col-md-5">
                <label class="form-label small fw-bold text-dark">Tiempo Estimado</label>
                <select class="form-select py-2 shadow-none" formControlName="duracion">
                  <option [value]="15">15 minutos</option>
                  <option [value]="30">30 minutos</option>
                  <option [value]="45">45 minutos</option>
                  <option [value]="60">1 hora</option>
                  <option [value]="90">1h 30min</option>
                  <option [value]="120">2 horas</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div class="mb-2">
            <label class="form-label small fw-bold text-dark">Observaciones</label>
            <textarea class="form-control shadow-none" formControlName="notas" rows="3" 
                      placeholder="Ej. El paciente tiene sensibilidad dental..."></textarea>
          </div>
          <!-- Section: Pago Inicial -->
          <div class="mb-4">
            <div class="d-flex align-items-center gap-2 mb-3">
              <span class="fw-bold text-primary small text-uppercase tracking-wider">04. Pago / Abono Inicial (Opcional)</span>
              <hr class="flex-grow-1 opacity-10">
            </div>
            
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label small fw-bold text-dark">Abono Inicial (S/.)</label>
                <input type="number" class="form-control py-2 shadow-none border-primary" formControlName="abono_inicial" placeholder="0.00"
                       [class.is-invalid]="form.get('abono_inicial')?.invalid && form.get('abono_inicial')?.touched"
                       [max]="precioTratamientoSeleccionado">
                <div class="invalid-feedback" *ngIf="form.get('abono_inicial')?.hasError('max')">No puede exceder el total de S/. {{ precioTratamientoSeleccionado.toFixed(2) }}</div>
                <small class="text-muted d-block mt-1">Si deja un abono, la cita se confirmará. Máx: S/. {{ precioTratamientoSeleccionado ? precioTratamientoSeleccionado.toFixed(2) : '—' }}</small>
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-bold text-dark">Método de Pago</label>
                <select class="form-select py-2 shadow-none" formControlName="metodo_pago_inicial">
                  <option value="Efectivo">💵 Efectivo</option>
                  <option value="Tarjeta crédito">💳 Tarjeta de Crédito</option>
                  <option value="Tarjeta débito">💳 Tarjeta de Débito</option>
                  <option value="Transferencia">🏦 Transferencia</option>
                  <option value="Yape">📱 Yape</option>
                  <option value="Plin">📱 Plin</option>
                </select>
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="modal-footer border-top-0 p-4 pt-0 gap-2">
        <button type="button" class="btn btn-light px-4 fw-bold text-muted border" (click)="dialogRef.close()">
          Cancelar
        </button>
        <button type="button" class="btn btn-primary px-4 fw-bold shadow-sm"
                [disabled]="form.invalid || submitting"
                (click)="onSubmit()">
          <span *ngIf="submitting" class="spinner-border spinner-border-sm me-2"></span>
          {{ submitting ? 'Agendando...' : 'Confirmar Cita' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; border-radius: 12px; overflow: hidden; }
    .form-control:focus, .form-select:focus { border-color: var(--primary-color); box-shadow: 0 0 0 0.25rem rgba(15, 76, 129, 0.1); }
    .custom-scrollbar { max-height: 60vh; overflow-y: auto; }
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #f8f9fa; border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #dee2e6; border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #adb5bd; }
  `]
})
export class AppointmentFormDialogComponent implements OnInit {
  form!: FormGroup;
  submitting = false;
  minDate: string;

  pacientes: any[] = [];
  dentistas: any[] = [];
  tratamientos: any[] = [];
  precioTratamientoSeleccionado: number = 0;

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private userService: UserService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<AppointmentFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AppointmentFormDialogData
  ) {
    // Set min date to today
    const now = new Date();
    this.minDate = now.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.buildForm();
    this.loadFormData();
  }

  private buildForm(): void {
    // Default to tomorrow at 9:00 AM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    tomorrow.setMinutes(tomorrow.getMinutes() - tomorrow.getTimezoneOffset());
    const defaultDate = tomorrow.toISOString().slice(0, 16);

    this.form = this.fb.group({
      id_paciente: [null, Validators.required],
      id_tratamiento: [null, Validators.required],
      id_dentista: [null],
      fecha: [this.minDate, Validators.required],
      hora: ['09:00', Validators.required],
      duracion: [30],
      notas: [''],
      abono_inicial: [0, [Validators.min(0)]],
      metodo_pago_inicial: ['Efectivo']
    });
  }

  private loadFormData(): void {
    if (this.data.catalogos) {
      this.pacientes = this.data.catalogos.pacientes || [];
      this.dentistas = this.data.catalogos.dentistas || [];
      this.tratamientos = this.data.catalogos.tratamientos || [];
    }
  }

  openNewPatientDialog(): void {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '640px',
      maxWidth: '95vw',
      panelClass: 'bootstrap-modal-container',
      disableClose: true,
      data: { 
        user: { id_rol: 4, activo: 1 },
        forceRole: 4 // Hint for the dialog to lock the role
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Enforce role
        result.id_rol = 4;
        
        this.userService.registerUser(result).subscribe({
          next: (res) => {
            import('sweetalert2').then(Swal => {
              Swal.default.fire({
                icon: 'success',
                title: '¡Registrado!',
                text: 'El paciente ha sido creado correctamente.',
                timer: 2000,
                showConfirmButton: false
              });
            });
            
            // Reload pacientes array
            this.appointmentService.getPacientes().subscribe(pacientes => {
              this.pacientes = pacientes;
              // Auto-select the newly created patient
              if (res.id) {
                this.form.patchValue({ id_paciente: res.id });
              }
            });
          },
          error: (err) => {
            const msg = err.error?.error || 'No se pudo registrar el paciente.';
            import('sweetalert2').then(Swal => {
              Swal.default.fire('Error', msg, 'error');
            });
          }
        });
      }
    });
  }

  onTratamientoChange(): void {
    const idTratamiento = Number(this.form.get('id_tratamiento')?.value);
    const tratamiento = this.tratamientos.find(t => t.id_tratamiento === idTratamiento);
    if (tratamiento?.duracion_estimada) {
      this.form.patchValue({ duracion: tratamiento.duracion_estimada });
    }
    this.precioTratamientoSeleccionado = tratamiento ? Number(tratamiento.precio) : 0;
    // Actualizar validador max del abono_inicial
    const abonoCtrl = this.form.get('abono_inicial');
    if (abonoCtrl) {
      abonoCtrl.setValidators([Validators.min(0), Validators.max(this.precioTratamientoSeleccionado)]);
      abonoCtrl.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting = true;
    
    const formData = { ...this.form.value };
    formData.fecha_hora = `${formData.fecha}T${formData.hora}:00`;
    delete formData.fecha;
    delete formData.hora;

    // Simulate Double Booking validation
    if (formData.id_dentista) {
      this.appointmentService.getAppointments().subscribe({
        next: (citas) => {
          const isDoubleBooked = citas.some(c => 
            (c as any).id_dentista == formData.id_dentista && 
            c.fecha_hora?.startsWith(`${formData.fecha_hora.substring(0, 16)}`) &&
            c.estado !== 'Cancelada'
          );
          
          if (isDoubleBooked) {
            import('sweetalert2').then(Swal => {
              Swal.default.fire('Horario Ocupado', 'El doctor ya tiene una cita reservada en ese horario. Por favor, elige otro.', 'warning');
            });
            this.submitting = false;
          } else {
            this.dialogRef.close(formData);
          }
        },
        error: () => {
          this.dialogRef.close(formData); // Proceed if error fetching
        }
      });
    } else {
      this.dialogRef.close(formData);
    }
  }
}
