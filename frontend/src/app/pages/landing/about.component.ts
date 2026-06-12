import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <section id="nosotros" class="py-5" style="background-color: #fafcfd;">
      <div class="container py-lg-5">
        <div class="row align-items-center g-5">
          <!-- Image Side -->
          <div class="col-lg-6">
            <div class="position-relative">
              <div class="position-absolute top-0 start-0 w-100 h-100 bg-primary bg-opacity-5 rounded-5 transform-rotate-n3"></div>
              <img src="assets/img/imagenesClinica/foto.png" alt="ZAZDENT Clinic" 
                   class="img-fluid rounded-5 shadow-lg position-relative z-1 border border-white border-4">
              
              <div class="position-absolute bottom-0 start-0 mb-4 ms-n4 bg-white p-4 rounded-4 shadow-xl z-2 border d-none d-md-block animate-float">
                <div class="d-flex align-items-center gap-3">
                  <div class="bg-primary text-white p-3 rounded-circle d-flex align-items-center justify-content-center" style="width: 54px; height: 54px;">
                    <lucide-icon name="award" [size]="28"></lucide-icon>
                  </div>
                  <div>
                    <h4 class="h5 fw-bold text-dark mb-0">Certificados</h4>
                    <p class="text-muted small mb-0">ISO 9001 Salud Dental</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Content Side -->
          <div class="col-lg-6">
            <span class="text-primary fw-bold text-uppercase small tracking-wider">Sobre Nosotros</span>
            <h2 class="display-5 fw-bold text-dark mt-2 mb-4 tracking-tight">Cuidamos tu Sonrisa con <span class="text-primary">Ciencia y Corazón</span></h2>
            <p class="lead text-muted mb-5">En ZAZDENT no solo tratamos dientes; cuidamos personas. Nuestra filosofía une la precisión tecnológica con un trato profundamente humano para que cada visita sea una experiencia de bienestar.</p>
            
            <div class="row g-4">
              <div class="col-sm-6" *ngFor="let item of features">
                <div class="d-flex align-items-start gap-3">
                  <div class="bg-white shadow-sm p-2 rounded-3 text-primary border border-light">
                    <lucide-icon [name]="item.icon" [size]="20"></lucide-icon>
                  </div>
                  <div>
                    <h5 class="h6 fw-bold text-dark mb-1">{{item.title}}</h5>
                    <p class="text-muted small mb-0">{{item.desc}}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="mt-5 pt-2">
              <button class="btn btn-primary rounded-pill px-5 py-3 fw-bold shadow-sm transition-all">
                Nuestra Historia
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .transform-rotate-n3 {
      transform: rotate(-3deg);
      z-index: 0;
    }
    .shadow-xl {
      box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important;
    }
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-15px); }
    }
  `]
})
export class AboutComponent {
  features = [
    { title: 'Tecnología 3D', desc: 'Diagnósticos por imagen de alta precisión.', icon: 'camera' },
    { title: 'Especialistas', desc: 'Equipo médico en constante formación.', icon: 'users' },
    { title: 'Ambiente Zen', desc: 'Instalaciones diseñadas para tu calma.', icon: 'wind' },
    { title: 'Financiamiento', desc: 'Planes flexibles para cada tratamiento.', icon: 'credit-card' }
  ];
}
