import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="testimonios" class="py-5" style="background-color: #fafcfd;">
      <div class="container py-lg-5">
        <div class="section-title text-center mb-5">
          <span class="text-primary fw-bold text-uppercase small tracking-wider">Testimonios</span>
          <h2 class="display-5 fw-bold mt-2">Voces de Confianza</h2>
        </div>

        <div class="row g-4">
          <div class="col-md-6" *ngFor="let t of testimonials">
            <div class="testimonial-card h-100 d-flex flex-column">
              <div class="rating mb-3">
                <i class="fas fa-star" *ngFor="let star of [1,2,3,4,5]"></i>
              </div>
              <p class="fs-5 mb-4 text-muted italic" style="font-style: italic;">"{{t.text}}"</p>
              <div class="d-flex align-items-center mt-auto pt-3 border-top">
                <img [src]="t.image" [alt]="t.name" class="testimonial-avatar me-3">
                <div>
                  <h5 class="mb-0 fw-bold">{{t.name}}</h5>
                  <small class="text-primary fw-bold text-uppercase" style="font-size: 0.75rem;">{{t.role}}</small>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>

  `
})
export class TestimonialsComponent {
  testimonials = [
    { name: 'Ana S.', role: 'Paciente de Ortodoncia', text: 'El tratamiento de ortodoncia superó mis expectativas. El equipo es muy profesional y el ambiente es muy agradable.', image: 'assets/img/imagenesClinica/imapaciente.png' },
    { name: 'Carlos M.', role: 'Padre de paciente', text: 'Mi hijo ya no le tiene miedo al dentista gracias a la Dra. Diego. Las instalaciones son perfectas para niños.', image: 'assets/img/imagenesClinica/pacienteCarlos.png' }
  ];
}
