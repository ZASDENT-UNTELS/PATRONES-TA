import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LucideAngularModule } from 'lucide-angular';
import { AppointmentService } from '../../../services/appointment.service';
import { forkJoin } from 'rxjs';

export interface AppointmentFormDialogData {
  mode: 'create';
}

@Component({
  selector: 'app-appointment-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    LucideAngularModule
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <div class="header-icon">
          <lucide-icon name="calendar" class="header-lucide"></lucide-icon>
        </div>
        <h2 mat-dialog-title>Nueva Cita</h2>
        <p class="dialog-subtitle">Programa una nueva cita para un paciente</p>
      </div>

      <mat-dialog-content>
        <div *ngIf="loading" class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Cargando datos...</p>
        </div>

        <form *ngIf="!loading" [formGroup]="form" class="appointment-form">
          <!-- Paciente -->
          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Paciente</mat-label>
              <mat-select formControlName="id_paciente">
                <mat-option *ngFor="let p of pacientes" [value]="p.id_paciente || p.id">
                  {{ p.nombre_apellido || p.nombre }}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="form.get('id_paciente')?.hasError('required')">Seleccione un paciente</mat-error>
            </mat-form-field>
          </div>

          <!-- Tratamiento + Dentista -->
          <div class="form-row two-cols">
            <mat-form-field appearance="outline">
              <mat-label>Tratamiento</mat-label>
              <mat-select formControlName="id_tratamiento" (selectionChange)="onTratamientoChange($event.value)">
                <mat-option *ngFor="let t of tratamientos" [value]="t.id_tratamiento">
                  {{ t.nombre }} - S/. {{ t.precio }}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="form.get('id_tratamiento')?.hasError('required')">Seleccione un tratamiento</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Dentista</mat-label>
              <mat-select formControlName="id_dentista">
                <mat-option [value]="null">Sin asignar</mat-option>
                <mat-option *ngFor="let d of dentistas" [value]="d.id_dentista">
                  {{ d.nombre }} {{ d.especialidad ? '(' + d.especialidad + ')' : '' }}
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <!-- Fecha/Hora + Duración -->
          <div class="form-row two-cols">
            <mat-form-field appearance="outline">
              <mat-label>Fecha y Hora</mat-label>
              <input matInput type="datetime-local" formControlName="fecha_hora"
                     [min]="minDateTime">
              <mat-error *ngIf="form.get('fecha_hora')?.hasError('required')">La fecha es requerida</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Duración (minutos)</mat-label>
              <mat-select formControlName="duracion">
                <mat-option [value]="15">15 min</mat-option>
                <mat-option [value]="30">30 min</mat-option>
                <mat-option [value]="45">45 min</mat-option>
                <mat-option [value]="60">1 hora</mat-option>
                <mat-option [value]="90">1h 30min</mat-option>
                <mat-option [value]="120">2 horas</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <!-- Notas -->
          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Notas (opcional)</mat-label>
              <textarea matInput formControlName="notas" rows="3"
                        placeholder="Observaciones o instrucciones especiales..."></textarea>
            </mat-form-field>
          </div>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close class="cancel-btn">Cancelar</button>
        <button mat-raised-button color="primary" class="submit-btn"
                [disabled]="form.invalid || submitting || loading"
                (click)="onSubmit()">
          <lucide-icon name="calendar" class="btn-icon"></lucide-icon>
          {{ submitting ? 'Creando...' : 'Crear Cita' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      min-width: 520px;
    }

    .dialog-header {
      text-align: center;
      padding: 8px 24px 0;
    }

    .header-icon {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 12px;
      background: linear-gradient(135deg, #10b981, #059669);
    }

    .header-lucide {
      width: 28px;
      height: 28px;
      color: white;
    }

    h2[mat-dialog-title] {
      margin: 0;
      font-size: 22px;
      font-weight: 700;
      color: #1e293b;
    }

    .dialog-subtitle {
      color: #64748b;
      font-size: 14px;
      margin: 4px 0 0;
    }

    mat-dialog-content {
      padding: 16px 24px !important;
      max-height: 65vh;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px 0;
      gap: 16px;
      color: #64748b;
    }

    .appointment-form {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .form-row {
      display: flex;
      gap: 16px;
    }

    .form-row.two-cols > * {
      flex: 1;
    }

    .full-width {
      width: 100%;
    }

    mat-dialog-actions {
      padding: 12px 24px 16px !important;
      gap: 8px;
    }

    .cancel-btn {
      color: #64748b;
      font-weight: 500;
    }

    .submit-btn {
      border-radius: 8px;
      font-weight: 600;
      padding: 0 24px;
      height: 40px;
    }

    .btn-icon {
      width: 16px;
      height: 16px;
      margin-right: 6px;
    }
  `]
})
export class AppointmentFormDialogComponent implements OnInit {
  form!: FormGroup;
  loading = true;
  submitting = false;
  minDateTime: string;

  pacientes: any[] = [];
  dentistas: any[] = [];
  tratamientos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    public dialogRef: MatDialogRef<AppointmentFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AppointmentFormDialogData
  ) {
    // Set min datetime to now
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    this.minDateTime = now.toISOString().slice(0, 16);
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
      fecha_hora: [defaultDate, Validators.required],
      duracion: [30],
      notas: ['']
    });
  }

  private loadFormData(): void {
    forkJoin({
      pacientes: this.appointmentService.getPacientes(),
      dentistas: this.appointmentService.getDentistas(),
      tratamientos: this.appointmentService.getTratamientos()
    }).subscribe({
      next: (data) => {
        this.pacientes = data.pacientes;
        this.dentistas = data.dentistas;
        this.tratamientos = data.tratamientos;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading form data', err);
        this.loading = false;
      }
    });
  }

  onTratamientoChange(idTratamiento: number): void {
    const tratamiento = this.tratamientos.find(t => t.id_tratamiento === idTratamiento);
    if (tratamiento?.duracion_estimada) {
      this.form.patchValue({ duracion: tratamiento.duracion_estimada });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting = true;
    this.dialogRef.close(this.form.value);
  }
}
