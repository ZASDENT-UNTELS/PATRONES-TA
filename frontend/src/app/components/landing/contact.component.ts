import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section id="contacto" class="py-5 contact-section">
      <div class="container py-lg-5">
        <div class="section-title text-center mb-5">
          <span class="text-primary fw-bold text-uppercase small tracking-wider">Contacto</span>
          <h2 class="display-5 fw-bold mt-2">Agenda tu Consulta</h2>
          <p class="lead text-muted mx-auto" style="max-width: 600px;">Estamos listos para atenderte. Completa el formulario y nos comunicaremos contigo en breve.</p>
        </div>

        <div class="row g-4 align-items-stretch">
          <div class="col-lg-7">
            <div class="contact-card h-100">
              <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="needs-validation" novalidate>
                <div class="row g-3">
                  <div class="col-md-6 mb-3">
                    <label class="form-label small fw-bold">Nombre Completo</label>
                    <input type="text" class="form-control" formControlName="nombre" placeholder="Ej. Juan Pérez">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label small fw-bold">Teléfono / WhatsApp</label>
                    <input type="tel" class="form-control" formControlName="telefono" placeholder="Ej. +51 999 999 999">
                  </div>
                </div>
                
                <div class="mb-3">
                  <label class="form-label small fw-bold">Email Corporativo / Personal</label>
                  <input type="email" class="form-control" formControlName="email" placeholder="correo@ejemplo.com">
                </div>
                
                <div class="row g-3">
                  <div class="col-md-6 mb-3">
                    <label class="form-label small fw-bold">Tratamiento de Interés</label>
                    <select class="form-select" formControlName="tratamiento">
                      <option value="">Selecciona...</option>
                      <option *ngFor="let t of treatments" [value]="t">{{t}}</option>
                    </select>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label small fw-bold">Fecha Sugerida</label>
                    <input type="date" class="form-control" formControlName="fecha">
                  </div>
                </div>
                
                <div class="mb-3">
                  <label class="form-label small fw-bold">Especialista Preferido</label>
                  <select class="form-select" formControlName="doctor">
                    <option value="">Selecciona un doctor</option>
                    <option *ngFor="let d of doctors" [value]="d">{{d}}</option>
                  </select>
                </div>
                
                <div class="mb-4">
                  <label class="form-label small fw-bold">Comentarios Adicionales</label>
                  <textarea class="form-control" formControlName="mensaje" rows="4" placeholder="¿Tienes alguna duda específica?"></textarea>
                </div>
                
                <button type="submit" class="btn btn-primary btn-lg w-100 py-3 rounded-pill fw-bold" [disabled]="contactForm.invalid">
                  Confirmar Solicitud de Cita
                </button>
              </form>
            </div>
          </div>
          
          <div class="col-lg-5">
            <div class="bg-primary text-white p-5 rounded-4 h-100 shadow-lg d-flex flex-column justify-content-between">
              <div>
                <h3 class="h4 fw-bold mb-4">Información Directa</h3>
                
                <div class="d-flex mb-4 gap-3">
                  <div class="bg-white bg-opacity-10 p-3 rounded-circle" style="width: 50px; height: 50px;">
                    <i class="fas fa-map-marker-alt"></i>
                  </div>
                  <div>
                    <h4 class="h6 fw-bold mb-1">Visítanos</h4>
                    <p class="small mb-0 opacity-75">San Borja, Lima, Perú</p>
                    <a href="https://maps.app.goo.gl/3gaRyeZ3TM8jopUG8" class="text-white small text-decoration-underline" target="_blank">Abrir en Maps</a>
                  </div>
                </div>
                
                <div class="d-flex mb-4 gap-3">
                  <div class="bg-white bg-opacity-10 p-3 rounded-circle" style="width: 50px; height: 50px;">
                    <i class="fas fa-phone-alt"></i>
                  </div>
                  <div>
                    <h4 class="h6 fw-bold mb-1">Llamadas y WhatsApp</h4>
                    <p class="small mb-0 opacity-75">+51 916 901 370</p>
                    <p class="small mb-0 opacity-75">Atención inmediata</p>
                  </div>
                </div>
                
                <div class="d-flex mb-4 gap-3">
                  <div class="bg-white bg-opacity-10 p-3 rounded-circle" style="width: 50px; height: 50px;">
                    <i class="fas fa-envelope"></i>
                  </div>
                  <div>
                    <h4 class="h6 fw-bold mb-1">Consultas Digitales</h4>
                    <p class="small mb-0 opacity-75">zazdent4@gmail.com</p>
                  </div>
                </div>
                
                <div class="d-flex mb-4 gap-3">
                  <div class="bg-white bg-opacity-10 p-3 rounded-circle" style="width: 50px; height: 50px;">
                    <i class="fas fa-clock"></i>
                  </div>
                  <div>
                    <h4 class="h6 fw-bold mb-1">Horarios Premium</h4>
                    <p class="small mb-0 opacity-75">Lun - Vie: 09:00 - 19:00</p>
                    <p class="small mb-0 opacity-75">Sáb: 09:00 - 14:00</p>
                  </div>
                </div>
              </div>
              
              <div class="pt-4 border-top border-white border-opacity-20">
                <h4 class="h6 fw-bold mb-3">Redes Corporativas</h4>
                <div class="d-flex gap-3">
                  <a href="#" class="social-icon-light"><i class="fab fa-facebook-f"></i></a>
                  <a href="#" class="social-icon-light"><i class="fab fa-instagram"></i></a>
                  <a href="#" class="social-icon-light"><i class="fab fa-whatsapp"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <style>
      .social-icon-light {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        color: white;
        transition: all 0.3s ease;
      }
      .social-icon-light:hover { background: white; color: var(--primary-color); transform: translateY(-3px); }
    </style>

  `
})
export class ContactComponent {
  contactForm: FormGroup;
  treatments = ['Consulta Dental', 'Limpieza Dental', 'Ortodoncia Metálica', 'Endodoncia', 'Implantes Dentales', 'Extracción Dental', 'Odontopediatría', 'Periodoncia'];
  doctors = ['Dr. Carolay', 'Dr. Diego Quispe', 'Dr. Roshi'];

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      tratamiento: ['', Validators.required],
      fecha: ['', Validators.required],
      doctor: ['', Validators.required],
      mensaje: ['']
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log(this.contactForm.value);
      Swal.fire({
        icon: 'success',
        title: '¡Cita solicitada!',
        text: 'Nos pondremos en contacto contigo pronto.',
        confirmButtonColor: '#2a6496'
      });
      this.contactForm.reset();
    }
  }
}
