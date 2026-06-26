import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <section id="testimonios" class="py-5" style="background-color: #f8fafc;">
      <div class="container py-lg-5">
        <div class="row justify-content-center mb-5">
          <div class="col-lg-6 text-center">
            <span class="text-primary fw-bold text-uppercase small tracking-wider">Testimonios</span>
            <h2 class="display-5 fw-bold text-dark mt-2">Lo que dicen <span class="text-primary">nuestros pacientes</span></h2>
            <p class="text-muted mt-3">Tu satisfacción es nuestra mayor recompensa. Conoce la experiencia de quienes ya confían en nosotros.</p>
          </div>
        </div>

        <div class="row g-4">
          <div class="col-md-6 col-lg-4" *ngFor="let t of testimonials">
            <div class="card border-0 shadow-sm rounded-4 p-4 h-100 testimonial-card transition-all bg-white">
              <!-- Paciente Info -->
              <div class="d-flex align-items-center mb-4">
                <div class="position-relative">
                  <img [src]="t.image" [alt]="t.name" class="rounded-circle shadow-sm me-3 object-fit-cover" style="width: 60px; height: 60px;">
                  <div class="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle d-flex justify-content-center align-items-center border border-2 border-white" style="width: 24px; height: 24px; transform: translate(-10px, 5px);">
                    <lucide-icon name="quote" [size]="12"></lucide-icon>
                  </div>
                </div>
                <div>
                  <h5 class="mb-1 fw-bold text-dark">{{t.name}}</h5>
                  <small class="text-primary fw-bold text-uppercase tracking-wider" style="font-size: 0.65rem;">{{t.role}}</small>
                </div>
              </div>
              
              <!-- Estrellas -->
              <div class="d-flex gap-1 text-warning mb-3">
                <lucide-icon name="star" [size]="16" class="fill-warning" *ngFor="let s of [1,2,3,4,5]"></lucide-icon>
              </div>
              
              <!-- Texto -->
              <p class="text-muted lh-lg mb-0">"{{t.text}}"</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .testimonial-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.08) !important;
    }
    .fill-warning {
      fill: #ffc107;
    }
    .object-fit-cover {
      object-fit: cover;
    }
  `]
})
export class TestimonialsComponent {
  testimonials = [
    { 
      name: 'Ana Sandoval', 
      role: 'Paciente de Ortodoncia', 
      text: 'El tratamiento de ortodoncia invisible superó mis expectativas. El equipo fue increíblemente profesional y el resultado es simplemente perfecto. Ha cambiado mi vida.', 
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop' 
    },
    { 
      name: 'Carlos Mendoza', 
      role: 'Rehabilitación Oral', 
      text: 'Finalmente recuperé la confianza al sonreír gracias al Dr. Diego. Las instalaciones son de primer nivel, no sentí dolor y el trato es muy humano en cada visita.', 
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop' 
    },
    { 
      name: 'Lucía Paredes', 
      role: 'Madre de paciente', 
      text: 'Excelente atención para niños. Mi hijo le tenía pánico al dentista, pero ahora se siente seguro y feliz cada vez que vamos. Recomiendo totalmente a la Dra. Delina.', 
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop' 
    }
  ];
}
