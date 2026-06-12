import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <section id="contacto" class="py-5 bg-white">
      <div class="container py-lg-5">
        <div class="row g-5 align-items-center">
          <!-- Contact Info -->
          <div class="col-lg-5">
            <span class="text-primary fw-bold text-uppercase small tracking-wider">Contacto</span>
            <h2 class="display-5 fw-bold text-dark mt-2 mb-4 tracking-tight">Estamos <span class="text-primary">a un click</span> de distancia</h2>
            <p class="text-muted mb-5">Agenda tu consulta hoy mismo. Nuestro equipo se pondrá en contacto contigo en menos de 2 horas para confirmar tu cita.</p>
            
            <div class="d-flex flex-column gap-4">
              <div class="d-flex align-items-center gap-4 p-3 rounded-4 bg-light bg-opacity-50 transition-all border border-transparent hover-border-primary">
                <div class="bg-primary text-white p-3 rounded-circle shadow-sm">
                  <lucide-icon name="phone" [size]="20"></lucide-icon>
                </div>
                <div>
                  <h5 class="h6 fw-bold text-dark mb-1">Llámanos / WhatsApp</h5>
                  <p class="text-primary fw-bold mb-0">+51 916 901 370</p>
                </div>
              </div>
              
              <div class="d-flex align-items-center gap-4 p-3 rounded-4 bg-light bg-opacity-50 transition-all border border-transparent hover-border-primary">
                <div class="bg-primary text-white p-3 rounded-circle shadow-sm">
                  <lucide-icon name="mail" [size]="20"></lucide-icon>
                </div>
                <div>
                  <h5 class="h6 fw-bold text-dark mb-1">Escríbenos</h5>
                  <p class="text-muted mb-0 small">zazdent4@gmail.com</p>
                </div>
              </div>
              
              <div class="d-flex align-items-center gap-4 p-3 rounded-4 bg-light bg-opacity-50 transition-all border border-transparent hover-border-primary">
                <div class="bg-primary text-white p-3 rounded-circle shadow-sm">
                  <lucide-icon name="map-pin" [size]="20"></lucide-icon>
                </div>
                <div>
                  <h5 class="h6 fw-bold text-dark mb-1">Visítanos</h5>
                  <p class="text-muted mb-0 small">Av. Javier Prado Este 123, San Borja, Lima</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Form -->
          <div class="col-lg-7">
            <div class="card border-0 shadow-lg rounded-5 p-4 p-md-5 bg-white border border-light">
              <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="needs-validation">
                <div class="row g-3">
                  <div class="col-md-6 mb-3">
                    <label class="form-label small fw-bold text-dark">Nombre Completo</label>
                    <input type="text" class="form-control shadow-none py-2" formControlName="nombre" placeholder="Ej. Juan Pérez">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label small fw-bold text-dark">Teléfono</label>
                    <input type="tel" class="form-control shadow-none py-2" formControlName="telefono" placeholder="999 999 999">
                  </div>
                </div>
                
                <div class="mb-3">
                  <label class="form-label small fw-bold text-dark">Correo Electrónico</label>
                  <input type="email" class="form-control shadow-none py-2" formControlName="email" placeholder="correo@ejemplo.com">
                </div>
                
                <div class="mb-3">
                  <label class="form-label small fw-bold text-dark">Tratamiento de Interés</label>
                  <select class="form-select shadow-none py-2" formControlName="tratamiento">
                    <option value="">Selecciona una opción...</option>
                    <option *ngFor="let t of treatments" [value]="t">{{t}}</option>
                  </select>
                </div>
                
                <div class="mb-4">
                  <label class="form-label small fw-bold text-dark">¿En qué podemos ayudarte?</label>
                  <textarea class="form-control shadow-none" formControlName="mensaje" rows="4" placeholder="Cuéntanos brevemente tu caso..."></textarea>
                </div>
                
                <button type="submit" class="btn btn-primary btn-lg w-100 py-3 rounded-pill fw-bold shadow-lg transition-all" 
                        [disabled]="contactForm.invalid || submitting">
                  <span *ngIf="submitting" class="spinner-border spinner-border-sm me-2"></span>
                  {{ submitting ? 'Enviando...' : 'Solicitar Cita Ahora' }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hover-border-primary:hover {
      border-color: rgba(var(--primary-rgb), 0.3) !important;
      background-color: white !important;
      box-shadow: 0 8px 20px rgba(0,0,0,0.03);
    }
    .border-transparent { border-color: transparent; }
  `]
})
export class ContactComponent {
  contactForm: FormGroup;
  submitting = false;
  treatments = ['Ortodoncia', 'Implantes', 'Estética Dental', 'Odontopediatría', 'Endodoncia', 'Otro'];

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      tratamiento: ['', Validators.required],
      mensaje: ['']
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.submitting = true;
      setTimeout(() => {
        this.submitting = false;
        Swal.fire({
          icon: 'success',
          title: '¡Solicitud enviada!',
          text: 'Nos pondremos en contacto contigo en breve para confirmar tu cita.',
          confirmButtonColor: '#0f4c81',
          customClass: {
            confirmButton: 'btn btn-primary px-5 rounded-pill py-3 fw-bold'
          },
          buttonsStyling: false
        });
        this.contactForm.reset();
      }, 1500);
    }
  }
}
