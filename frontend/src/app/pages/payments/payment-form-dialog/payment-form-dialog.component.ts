import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LucideAngularModule } from 'lucide-angular';
import { Payment } from '../../../models/payment.model';

export interface PaymentFormDialogData {
  payment: Payment | null;
  totalReal?: number;
}

@Component({
  selector: 'app-payment-form-dialog',
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
          <div class="bg-success bg-opacity-10 text-success p-2 rounded-3">
            <lucide-icon name="dollar-sign" [size]="24"></lucide-icon>
          </div>
          <div>
            <h5 class="modal-title fw-bold mb-0">
              {{ isEditMode ? 'Detalle de Pago / Abono' : 'Registrar Nuevo Pago' }}
            </h5>
            <p class="text-muted small mb-0">Complete la información de facturación</p>
          </div>
        </div>
        <button type="button" class="btn-close shadow-none" (click)="dialogRef.close()"></button>
      </div>

      <!-- Body -->
      <div class="modal-body p-4 custom-scrollbar">
        <form [formGroup]="form">
          <div class="mb-4">
            <div class="d-flex align-items-center gap-2 mb-3">
              <span class="fw-bold text-success small text-uppercase tracking-wider">01. Datos del Paciente y Concepto</span>
              <hr class="flex-grow-1 opacity-10">
            </div>
            
            <div class="row g-3">
              <div class="col-md-5">
                <label class="form-label small fw-bold text-dark">Paciente</label>
                <input type="text" class="form-control py-2 shadow-none" formControlName="nombre_paciente" 
                       placeholder="Nombre del paciente..."
                       [class.is-invalid]="form.get('nombre_paciente')?.invalid && form.get('nombre_paciente')?.touched">
              </div>
              <div class="col-md-4">
                <label class="form-label small fw-bold text-dark">Tratamiento</label>
                <input type="text" class="form-control py-2 shadow-none" formControlName="nombre_tratamiento" 
                       placeholder="Ej. Ortodoncia..."
                       [class.is-invalid]="form.get('nombre_tratamiento')?.invalid && form.get('nombre_tratamiento')?.touched">
              </div>
              <div class="col-md-3">
                <label class="form-label small fw-bold text-dark">Total (S/.)</label>
                <input type="number" class="form-control py-2 shadow-none bg-light text-success fw-bold" formControlName="total" readonly>
              </div>
            </div>
          </div>

          <div class="mb-4" *ngIf="historialPagos && historialPagos.length > 0">
            <div class="d-flex align-items-center gap-2 mb-3">
              <span class="fw-bold text-success small text-uppercase tracking-wider">Historial de Abonos Anteriores</span>
              <hr class="flex-grow-1 opacity-10">
            </div>
            <div class="table-responsive border rounded bg-white">
              <table class="table table-sm table-hover mb-0">
                <thead class="table-light text-muted small">
                  <tr>
                    <th class="py-2 px-3">Fecha</th>
                    <th class="py-2 px-3">Método</th>
                    <th class="py-2 px-3 text-end">Monto</th>
                  </tr>
                </thead>
                <tbody class="small align-middle">
                  <tr *ngFor="let p of historialPagos" class="align-middle" [class.opacity-50]="p.estado.toLowerCase() === 'anulado' || p.estado.toLowerCase() === 'reembolsado'">
                    <td class="text-secondary px-3">
                      {{ p.fecha_pago | date:'dd/MM/yyyy' }}
                      <span *ngIf="p.estado.toLowerCase() === 'anulado' || p.estado.toLowerCase() === 'reembolsado'" class="badge bg-danger ms-1" style="font-size: 0.65rem;">{{ p.estado }}</span>
                    </td>
                    <td class="text-secondary px-3">{{ p.metodo_pago }}</td>
                    <td class="px-3 text-end fw-bold" [ngClass]="p.estado.toLowerCase() === 'anulado' || p.estado.toLowerCase() === 'reembolsado' ? 'text-danger text-decoration-line-through' : 'text-success'">
                      + S/. {{ (p.monto * 1).toFixed(2) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="mb-4" *ngIf="!isFullyPaid">
            <div class="d-flex align-items-center gap-2 mb-3">
              <span class="fw-bold text-success small text-uppercase tracking-wider">02. Detalles del Abono</span>
              <hr class="flex-grow-1 opacity-10">
            </div>
            
            <div class="row g-3">
              <div class="col-md-4">
                <label class="form-label small fw-bold text-dark">Monto Abonado</label>
                <input type="number" class="form-control py-2 shadow-none bg-light" formControlName="pagado_anterior" readonly>
              </div>
              <div class="col-md-4">
                <label class="form-label small fw-bold text-dark">{{ isEditMode ? 'Abono de Hoy (S/.)' : 'Monto a Pagar (S/.)' }}</label>
                <input type="number" class="form-control py-2 shadow-none border-success" formControlName="abono_hoy" placeholder="0.00"
                       [class.is-invalid]="form.get('abono_hoy')?.invalid && form.get('abono_hoy')?.touched">
              </div>
              <div class="col-md-4">
                <label class="form-label small fw-bold text-dark">Nuevo Saldo</label>
                <input type="number" class="form-control py-2 shadow-none bg-light text-danger fw-bold" formControlName="saldo_nuevo" readonly>
              </div>
            </div>
          </div>

          <div class="mb-2" *ngIf="!isFullyPaid">
            <div class="d-flex align-items-center gap-2 mb-3">
              <span class="fw-bold text-success small text-uppercase tracking-wider">03. Método y Fecha</span>
              <hr class="flex-grow-1 opacity-10">
            </div>
            
            <div class="row g-3 align-items-end">
              <div class="col-md-5">
                <label class="form-label small fw-bold text-dark">Método de Pago</label>
                <select class="form-select py-2 shadow-none" formControlName="metodo_pago">
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta crédito">Tarjeta de Crédito</option>
                  <option value="Tarjeta débito">Tarjeta de Débito</option>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Yape">Yape</option>
                  <option value="Plin">Plin</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label small fw-bold text-dark">Fecha de Pago</label>
                <input type="date" class="form-control py-2 shadow-none" formControlName="fecha_pago">
              </div>
              <div class="col-md-3">
                <label class="form-label small fw-bold text-dark">Estado</label>
                <select class="form-select py-2 shadow-none" formControlName="estado">
                  <option value="Pendiente">Pendiente</option>
                  <option value="Parcial">Parcial</option>
                  <option value="Pagado">Pagado</option>
                </select>
              </div>
            </div>
            
            <div class="mt-3">
              <label class="form-label small fw-bold text-dark">Notas (Opcional)</label>
              <textarea class="form-control shadow-none" formControlName="notas" rows="2" placeholder="Nro de operación, banco, etc."></textarea>
            </div>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="modal-footer border-top-0 p-4 pt-0 gap-2">
        <button type="button" class="btn btn-light px-4 fw-bold text-muted border" (click)="dialogRef.close()">
          {{ isFullyPaid ? 'Cerrar' : 'Cancelar' }}
        </button>
        <button type="button" class="btn btn-success px-4 fw-bold shadow-sm"
                *ngIf="!isFullyPaid"
                [disabled]="form.invalid || submitting || form.get('abono_hoy')?.value <= 0"
                (click)="onSubmit()">
          <span *ngIf="submitting" class="spinner-border spinner-border-sm me-2"></span>
          {{ submitting ? 'Guardando...' : 'Confirmar Pago' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; border-radius: 12px; overflow: hidden; }
    .form-control:focus, .form-select:focus { border-color: #198754; box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.25); }
    .custom-scrollbar { max-height: 60vh; overflow-y: auto; }
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #f8f9fa; border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #dee2e6; border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #adb5bd; }
  `]
})
export class PaymentFormDialogComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  submitting = false;
  historialPagos: Payment[] = [];
  isFullyPaid = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PaymentFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PaymentFormDialogData
  ) { }

  ngOnInit(): void {
    // Si viene un pago consolidado, cargamos su historial
    if (this.data.payment && this.data.payment.historial_pagos) {
      this.historialPagos = this.data.payment.historial_pagos;
    }
    
    // Es modo edición (Registrar Abono) solo si el pago ya existe en la BD (tiene id_pago)
    this.isEditMode = !!(this.data.payment && this.data.payment.id_pago);
    this.buildForm();
    
    // Auto-calculate saldo based on total and monto
    this.form.get('total')?.valueChanges.subscribe(() => this.calculateSaldo());
    this.form.get('monto')?.valueChanges.subscribe(() => this.calculateSaldo());
  }

  private buildForm(): void {
    const today = new Date().toISOString().split('T')[0];
    const initialMonto = this.data.payment?.monto_total_pagado || this.data.payment?.acumulado_historico || this.data.payment?.monto || 0;
    
    // Parsear fecha de pago si viene con hora (YYYY-MM-DD HH:MM:SS)
    let fechaPago = today;
    if (this.data.payment?.fecha_pago) {
      fechaPago = this.data.payment.fecha_pago.split(' ')[0]; // Extraer solo la fecha
    }
    
    const pagadoAnterior = initialMonto;
    // Si viene de Citas, tiene totalReal. Si viene de Pagos, tiene costo_tratamiento
    const totalAUsar = this.data.totalReal !== undefined ? this.data.totalReal : (this.data.payment?.costo_tratamiento || pagadoAnterior);
    
    const st = this.data.payment?.estado?.toLowerCase() || '';
    const isAnulado = st === 'anulado' || st === 'reembolsado';
    this.isFullyPaid = isAnulado || (this.isEditMode && pagadoAnterior >= totalAUsar);
    const maxAbono = Math.max(0, totalAUsar - pagadoAnterior);

    this.form = this.fb.group({
      nombre_paciente: [{ value: this.data.payment?.nombre_paciente || '', disabled: true }, Validators.required],
      nombre_tratamiento: [{ value: this.data.payment?.nombre_tratamiento || '', disabled: true }, Validators.required],
      total: [{ value: totalAUsar, disabled: true }, Validators.required],
      pagado_anterior: [{ value: pagadoAnterior, disabled: true }],
      abono_hoy: [{ value: this.isEditMode ? 0 : totalAUsar, disabled: this.isFullyPaid }, [Validators.required, Validators.min(0), Validators.max(this.isFullyPaid ? 0 : maxAbono)]],
      saldo_nuevo: [{ value: 0, disabled: true }],
      monto: [pagadoAnterior], // campo oculto para el payload original
      metodo_pago: [{ value: this.data.payment?.metodo_pago || 'Efectivo', disabled: this.isFullyPaid }, Validators.required],
      fecha_pago: [{ value: fechaPago, disabled: this.isFullyPaid }, Validators.required],
      estado: [{ value: this.data.payment?.estado || 'Pendiente', disabled: true }, Validators.required],
      notas: [{ value: this.data.payment?.notas || '', disabled: this.isFullyPaid }]
    });
    
    this.calculateSaldo();
    this.form.get('abono_hoy')?.valueChanges.subscribe(() => this.calculateSaldo());
  }

  calculateSaldo(): void {
    const total = Number(this.form.get('total')?.value) || 0;
    const pagadoAnterior = Number(this.form.get('pagado_anterior')?.value) || 0;
    const abonoHoy = Number(this.form.get('abono_hoy')?.value) || 0;
    
    const montoTotalPagado = pagadoAnterior + abonoHoy;
    // Evitar problemas de precisión flotante redondeando a 2 decimales
    const saldoNuevo = Math.round((total - montoTotalPagado) * 100) / 100;
    
    this.form.patchValue({ 
      saldo_nuevo: saldoNuevo > 0 ? saldoNuevo : 0,
      monto: abonoHoy // ENVÍO SÓLO LO DE HOY A LA BD PARA EL INSERT
    }, { emitEvent: false });
    
    // Auto-update estado based on saldo. Note: this is the state of the *transaction* combined with the overall Cita.
    // However, the backend will recalculate the actual Cita state.
    if (saldoNuevo <= 0 && this.form.get('estado')?.value !== 'Pagado') {
      this.form.patchValue({ estado: 'Pagado' }, { emitEvent: false });
    } else if (saldoNuevo > 0 && abonoHoy > 0 && this.form.get('estado')?.value !== 'Parcial') {
      this.form.patchValue({ estado: 'Parcial' }, { emitEvent: false });
    } else if (abonoHoy === 0) {
      this.form.patchValue({ estado: 'Pendiente' }, { emitEvent: false });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting = true;
    
    // Preparar payload para la API (usar getRawValue para obtener el campo 'monto' deshabilitado si lo estuviera)
    const formData = { ...this.form.getRawValue() };
    
    // El backend requiere el id_cita. Si estamos registrando un pago existente, pasamos el id_cita.
    if (this.data.payment && this.data.payment.id_cita) {
      formData.id_cita = this.data.payment.id_cita;
    }
    
    // NOTA: Ya no pasamos id_pago para forzar un INSERT en lugar de un UPDATE,
    // a menos que estemos en un modo de edición estricto (que actualmente no existe en UI).
    // Queremos que cada abono sea una nueva fila en el Ledger.
    
    // Parsear monto a número explícitamente para evitar strings
    formData.monto = Number(formData.monto);
    
    // Solo enviamos los campos que el backend necesita, limpiando los extras
    delete formData.nombre_paciente;
    delete formData.nombre_tratamiento;
    delete formData.total;
    delete formData.pagado_anterior;
    delete formData.abono_hoy;
    delete formData.saldo_nuevo;

    this.dialogRef.close(formData);
  }
}
