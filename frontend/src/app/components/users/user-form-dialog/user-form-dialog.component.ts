import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { LucideAngularModule } from 'lucide-angular';
import { User } from '../../../models/user.model';

export interface UserFormDialogData {
  user: User | null;
}

@Component({
  selector: 'app-user-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatIconModule,
    LucideAngularModule
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <div class="header-icon" [class]="isEditMode ? 'edit-mode' : 'create-mode'">
          <lucide-icon [name]="isEditMode ? 'edit' : 'user-plus'" class="header-lucide"></lucide-icon>
        </div>
        <h2 mat-dialog-title>{{ isEditMode ? 'Editar Usuario' : 'Nuevo Usuario' }}</h2>
        <p class="dialog-subtitle">{{ isEditMode ? 'Modifica los datos del usuario' : 'Completa los datos para registrar un nuevo usuario' }}</p>
      </div>

      <mat-dialog-content>
        <form [formGroup]="form" class="user-form">
          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nombre Completo</mat-label>
              <input matInput formControlName="nombre_apellido" placeholder="Ej: Juan Pérez García">
              <mat-error *ngIf="form.get('nombre_apellido')?.hasError('required')">El nombre es requerido</mat-error>
            </mat-form-field>
          </div>

          <div class="form-row two-cols">
            <mat-form-field appearance="outline">
              <mat-label>Usuario</mat-label>
              <input matInput formControlName="usuario_usuario" placeholder="Ej: jperez">
              <mat-error *ngIf="form.get('usuario_usuario')?.hasError('required')">El usuario es requerido</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" placeholder="correo@ejemplo.com">
              <mat-error *ngIf="form.get('email')?.hasError('required')">El email es requerido</mat-error>
              <mat-error *ngIf="form.get('email')?.hasError('email')">Email inválido</mat-error>
            </mat-form-field>
          </div>

          <div class="form-row two-cols">
            <mat-form-field appearance="outline">
              <mat-label>{{ isEditMode ? 'Nueva Contraseña (opcional)' : 'Contraseña' }}</mat-label>
              <input matInput formControlName="password" [type]="hidePassword ? 'password' : 'text'"
                     [placeholder]="isEditMode ? 'Dejar vacío para no cambiar' : 'Mínimo 6 caracteres'">
              <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-error *ngIf="form.get('password')?.hasError('required')">La contraseña es requerida</mat-error>
              <mat-error *ngIf="form.get('password')?.hasError('minlength')">Mínimo 6 caracteres</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Teléfono</mat-label>
              <input matInput formControlName="telefono" placeholder="Ej: 987654321">
            </mat-form-field>
          </div>

          <div class="form-row two-cols">
            <mat-form-field appearance="outline">
              <mat-label>Rol</mat-label>
              <mat-select formControlName="id_rol">
                <mat-option [value]="1">
                  <span class="role-option">Administrador</span>
                </mat-option>
                <mat-option [value]="2">
                  <span class="role-option">Dentista</span>
                </mat-option>
                <mat-option [value]="3">
                  <span class="role-option">Recepcionista</span>
                </mat-option>
                <mat-option [value]="4">
                  <span class="role-option">Paciente</span>
                </mat-option>
              </mat-select>
              <mat-error *ngIf="form.get('id_rol')?.hasError('required')">El rol es requerido</mat-error>
            </mat-form-field>

            <div class="toggle-container">
              <label class="toggle-label">Estado</label>
              <mat-slide-toggle formControlName="activo" color="primary">
                {{ form.get('activo')?.value ? 'Activo' : 'Inactivo' }}
              </mat-slide-toggle>
            </div>
          </div>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close class="cancel-btn">Cancelar</button>
        <button mat-raised-button color="primary" class="submit-btn"
                [disabled]="form.invalid || submitting"
                (click)="onSubmit()">
          <lucide-icon [name]="isEditMode ? 'edit' : 'user-plus'" class="btn-icon"></lucide-icon>
          {{ submitting ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Registrar') }}
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
    }

    .header-icon.create-mode {
      background: linear-gradient(135deg, #1E88E5, #1565C0);
    }

    .header-icon.edit-mode {
      background: linear-gradient(135deg, #f59e0b, #d97706);
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

    .user-form {
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

    .toggle-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 8px 0;
      gap: 8px;
    }

    .toggle-label {
      font-size: 12px;
      font-weight: 500;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .role-option {
      display: flex;
      align-items: center;
      gap: 8px;
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
export class UserFormDialogComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  hidePassword = true;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserFormDialogData
  ) { }

  ngOnInit(): void {
    this.isEditMode = !!this.data.user;
    this.buildForm();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      nombre_apellido: [this.data.user?.nombre_apellido || '', Validators.required],
      usuario_usuario: [this.data.user?.usuario_usuario || '', Validators.required],
      email: [this.data.user?.email || '', [Validators.required, Validators.email]],
      password: ['', this.isEditMode ? [Validators.minLength(6)] : [Validators.required, Validators.minLength(6)]],
      telefono: [this.data.user?.telefono || ''],
      id_rol: [this.data.user?.id_rol || 4, Validators.required],
      activo: [this.data.user?.activo ?? true]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.submitting = true;
    const formData = { ...this.form.value };

    // Clean up empty optional fields
    if (!formData.password) {
      delete formData.password;
    }
    if (!formData.telefono) {
      formData.telefono = null;
    }

    // Convert activo boolean to number for backend
    formData.activo = formData.activo ? 1 : 0;

    this.dialogRef.close(formData);
  }
}
