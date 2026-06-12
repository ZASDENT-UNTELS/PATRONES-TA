import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LucideAngularModule } from 'lucide-angular';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { User } from '../../../models/user.model';

export interface UserFormDialogData {
  user: User | null;
  forceRole?: number;
}

@Component({
  selector: 'app-user-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule
  ],
  template: `
    <div class="modal-content border-0">
      <!-- Header -->
      <div class="modal-header border-bottom-0 p-4">
        <div class="d-flex align-items-center gap-3">
          <div class="bg-primary bg-opacity-10 text-primary p-2 rounded-3">
            <lucide-icon [name]="isEditMode ? 'edit' : 'user-plus'" [size]="24"></lucide-icon>
          </div>
          <div>
            <h5 class="modal-title fw-bold mb-0">
              {{ isEditMode ? 'Actualizar Perfil' : 'Registro de Usuario' }}
            </h5>
            <p class="text-muted small mb-0">Gestión de credenciales y nivel de acceso</p>
          </div>
        </div>
        <button type="button" class="btn-close shadow-none" (click)="dialogRef.close()"></button>
      </div>

      <!-- Body -->
      <div class="modal-body p-4 custom-scrollbar">
        <form [formGroup]="form">
          <!-- Section: Identity -->
          <div class="mb-4">
            <div class="d-flex align-items-center gap-2 mb-3">
              <span class="fw-bold text-primary small text-uppercase tracking-wider">01. Identidad Personal</span>
              <hr class="flex-grow-1 opacity-10">
            </div>
            
            <div class="mb-3">
              <label class="form-label small fw-bold text-dark">Nombre y Apellidos</label>
              <input type="text" class="form-control py-2 shadow-none" 
                     formControlName="nombre_apellido" 
                     placeholder="Ej. Adriana Silva Rojas"
                     [class.is-invalid]="form.get('nombre_apellido')?.invalid && form.get('nombre_apellido')?.touched">
              <div class="invalid-feedback">El nombre es obligatorio</div>
            </div>

            <div class="row g-3">
              <div class="col-md-7">
                <label class="form-label small fw-bold text-dark">Correo Electrónico</label>
                <input type="email" class="form-control py-2 shadow-none" 
                       formControlName="email" 
                       placeholder="correo@ejemplo.com"
                       [class.is-invalid]="form.get('email')?.invalid && form.get('email')?.touched">
                <div class="invalid-feedback">Ingresa un email válido</div>
              </div>
              <div class="col-md-5">
                <label class="form-label small fw-bold text-dark">Teléfono</label>
                <input type="tel" class="form-control py-2 shadow-none" 
                       formControlName="telefono" 
                       placeholder="Ej. 987654321">
              </div>
            </div>
          </div>

          <!-- Section: Security -->
          <div class="mb-2">
            <div class="d-flex align-items-center gap-2 mb-3">
              <span class="fw-bold text-primary small text-uppercase tracking-wider">02. Seguridad y Rol</span>
              <hr class="flex-grow-1 opacity-10">
            </div>

            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <label class="form-label small fw-bold text-dark">Nombre de Usuario</label>
                <input type="text" class="form-control py-2 shadow-none" 
                       formControlName="usuario_usuario" 
                       placeholder="usuario123"
                       [class.is-invalid]="form.get('usuario_usuario')?.invalid && form.get('usuario_usuario')?.touched">
              </div>
              <div class="col-md-6" *ngIf="!data.forceRole">
                <label class="form-label small fw-bold text-dark">Rol Asignado</label>
                <select class="form-select py-2 shadow-none" formControlName="id_rol">
                  <option value="" disabled selected>Seleccionar rol</option>
                  <option [value]="1">Administrador</option>
                  <option [value]="2">Dentista</option>
                  <option [value]="3">Recepcionista</option>
                  <option [value]="4">Paciente</option>
                </select>
              </div>
              <div class="col-md-6" *ngIf="data.forceRole">
                <label class="form-label small fw-bold text-dark">Rol Asignado</label>
                <input type="text" class="form-control py-2 shadow-none bg-light" value="Paciente" readonly disabled>
              </div>
            </div>

            <div class="row g-3 align-items-end">
              <div class="col-md-6">
                <label class="form-label small fw-bold text-dark">
                  {{ isEditMode ? 'Nueva Contraseña (opcional)' : 'Contraseña Temporal' }}
                </label>
                <div class="input-group">
                  <input [type]="hidePassword ? 'password' : 'text'" 
                         class="form-control py-2 shadow-none border-end-0" 
                         formControlName="usuario_clave"
                         [class.is-invalid]="form.get('usuario_clave')?.invalid && form.get('usuario_clave')?.touched">
                  <button class="btn border border-start-0 text-muted shadow-none" 
                          type="button" (click)="hidePassword = !hidePassword">
                    <lucide-icon [name]="hidePassword ? 'eye-off' : 'eye'" [size]="18"></lucide-icon>
                  </button>
                  <div class="invalid-feedback">Mínimo 6 caracteres</div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="p-2 border rounded-3 bg-light d-flex align-items-center justify-content-between" style="height: 43px;">
                  <span class="small fw-bold text-muted ps-1">ESTADO ACTIVO</span>
                  <div class="form-check form-switch mb-0 pe-1">
                    <input class="form-check-input shadow-none" type="checkbox" formControlName="activo">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Section: Clinical Data (Only visible if role is Paciente (4)) -->
          <div class="mb-2" *ngIf="isPaciente">
            <div class="d-flex align-items-center gap-2 mb-3">
              <span class="fw-bold text-primary small text-uppercase tracking-wider">03. Datos Clínicos (Paciente)</span>
              <hr class="flex-grow-1 opacity-10">
            </div>

            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <label class="form-label small fw-bold text-dark">Fecha de Nacimiento</label>
                <input type="date" class="form-control py-2 shadow-none" formControlName="fecha_nacimiento">
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-bold text-dark">Género</label>
                <select class="form-select py-2 shadow-none" formControlName="genero">
                  <option value="" disabled selected>Seleccionar...</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label small fw-bold text-dark">Alergias</label>
              <input type="text" class="form-control py-2 shadow-none" formControlName="alergias" placeholder="Ej. Penicilina, Látex (Dejar en blanco si no tiene)">
            </div>

            <div class="mb-3">
              <label class="form-label small fw-bold text-dark">Enfermedades Crónicas</label>
              <input type="text" class="form-control py-2 shadow-none" formControlName="enfermedades_cronicas" placeholder="Ej. Diabetes, Hipertensión">
            </div>

            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label small fw-bold text-dark">Seguro Médico</label>
                <input type="text" class="form-control py-2 shadow-none" formControlName="seguro_medico" placeholder="Ej. Pacífico, EPS">
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-bold text-dark">N° de Seguro</label>
                <input type="text" class="form-control py-2 shadow-none" formControlName="numero_seguro" placeholder="Ej. 12345678">
              </div>
            </div>
          </div>

          <!-- Section: Professional Data (Only visible if role is Dentista (2)) -->
          <div class="mb-2" *ngIf="isDentista">
            <div class="d-flex align-items-center gap-2 mb-3">
              <span class="fw-bold text-primary small text-uppercase tracking-wider">04. Datos Profesionales (Dentista)</span>
              <hr class="flex-grow-1 opacity-10">
            </div>

            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <label class="form-label small fw-bold text-dark">Especialidad Principal</label>
                <select class="form-select py-2 shadow-none" formControlName="id_especialidad">
                  <option [value]="null" disabled selected>Seleccionar especialidad...</option>
                  <option *ngFor="let esp of especialidades" [value]="esp.id_especialidad">
                    {{ esp.nombre }}
                  </option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-bold text-dark">Cédula Profesional</label>
                <input type="text" class="form-control py-2 shadow-none" formControlName="cedula_profesional" placeholder="N° Colegiatura (COP)">
              </div>
            </div>

            <div class="row g-3 mb-3">
              <div class="col-md-4">
                <label class="form-label small fw-bold text-dark">Experiencia (años)</label>
                <input type="number" class="form-control py-2 shadow-none" formControlName="experiencia" placeholder="0">
              </div>
              <div class="col-md-8">
                <label class="form-label small fw-bold text-dark">Biografía (Resumen)</label>
                <input type="text" class="form-control py-2 shadow-none" formControlName="biografia" placeholder="Breve reseña profesional...">
              </div>
            </div>

            <div class="row g-3">
              <div class="col-md-12">
                <label class="form-label small fw-bold text-dark">URL Foto de Perfil (Opcional)</label>
                <input type="text" class="form-control py-2 shadow-none" formControlName="foto" placeholder="https://ejemplo.com/foto.jpg">
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
          {{ submitting ? 'Guardando...' : (isEditMode ? 'Actualizar Perfil' : 'Crear Usuario') }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; border-radius: 12px; overflow: hidden; }
    .form-control:focus, .form-select:focus { border-color: var(--primary-color); box-shadow: 0 0 0 0.25rem rgba(15, 76, 129, 0.1); }
    .custom-scrollbar { max-height: 65vh; overflow-y: auto; }
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #f8f9fa; border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #dee2e6; border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #adb5bd; }
  `]
})
export class UserFormDialogComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  hidePassword = true;
  submitting = false;
  especialidades: any[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<UserFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserFormDialogData
  ) { }

  ngOnInit(): void {
    // Only true if we have a user with a real ID (not just a template with defaults like id_rol)
    this.isEditMode = !!(this.data.user && this.data.user.id_usuario);
    this.buildForm();
    this.loadEspecialidades();
  }

  private loadEspecialidades(): void {
    this.http.get<any[]>(`${environment.apiUrl}/especialidades`, { withCredentials: true })
      .subscribe({
        next: (data) => this.especialidades = data,
        error: (err) => console.error('Error cargando especialidades', err)
      });
  }

  private buildForm(): void {
    this.form = this.fb.group({
      nombre_apellido: [this.data.user?.nombre_apellido || '', Validators.required],
      usuario_usuario: [this.data.user?.usuario_usuario || '', Validators.required],
      email: [this.data.user?.email || '', [Validators.required, Validators.email]],
      usuario_clave: ['', this.isEditMode ? [Validators.minLength(6)] : [Validators.required, Validators.minLength(6)]],
      telefono: [this.data.user?.telefono || ''],
      id_rol: [this.data.forceRole || this.data.user?.id_rol || '', Validators.required],
      activo: [this.data.user?.activo ?? true],
      
      // Patient specific fields
      fecha_nacimiento: [this.data.user?.fecha_nacimiento || null],
      genero: [this.data.user?.genero || ''],
      alergias: [this.data.user?.alergias || ''],
      enfermedades_cronicas: [this.data.user?.enfermedades_cronicas || ''],
      seguro_medico: [this.data.user?.seguro_medico || ''],
      numero_seguro: [this.data.user?.numero_seguro || ''],

      // Dentist specific fields
      id_especialidad: [this.data.user?.id_especialidad || null],
      cedula_profesional: [this.data.user?.cedula_profesional || ''],
      biografia: [this.data.user?.biografia || ''],
      experiencia: [this.data.user?.experiencia || null],
      horario: [this.data.user?.horario || ''],
      foto: [this.data.user?.foto || '']
    });
  }

  get isPaciente(): boolean {
    return Number(this.form.get('id_rol')?.value) === 4;
  }

  get isDentista(): boolean {
    return Number(this.form.get('id_rol')?.value) === 2;
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.submitting = true;
    const formData = { ...this.form.value };

    if (!formData.usuario_clave) {
      delete formData.usuario_clave;
    }
    if (!formData.telefono) {
      formData.telefono = null;
    }

    formData.activo = formData.activo ? 1 : 0;
    this.dialogRef.close(formData);
  }
}
