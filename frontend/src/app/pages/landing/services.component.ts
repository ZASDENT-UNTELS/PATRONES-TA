import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <section id="servicios" class="py-5 bg-white">
      <div class="container py-lg-5">
        <div class="row justify-content-center mb-5">
          <div class="col-lg-7 text-center">
            <span class="text-primary fw-bold text-uppercase small tracking-wider">Tratamientos Especializados</span>
            <h2 class="display-5 fw-bold mt-2 text-dark">Soluciones Dentales de <span class="text-primary">Clase Mundial</span></h2>
            <p class="text-muted mt-3">Utilizamos tecnología de última generación para ofrecerte resultados excepcionales y una salud dental duradera.</p>
          </div>
        </div>
        
        <div class="row g-4">
          <div class="col-md-6 col-lg-3" *ngFor="let service of services">
            <div class="card border-0 shadow-sm rounded-4 h-100 transition-all service-card overflow-hidden">
              <div class="card-body p-4 d-flex flex-column">
                <div class="service-icon-box mb-4 bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
                  <lucide-icon [name]="service.icon" [size]="24"></lucide-icon>
                </div>
                <h3 class="h5 fw-bold text-dark mb-2">{{service.title}}</h3>
                <p class="text-muted small mb-4 flex-grow-1">{{service.description}}</p>
                
                <div class="d-flex align-items-center justify-content-between mt-auto pt-3 border-top border-light">
                  <div>
                    <span class="text-muted smaller d-block">Desde</span>
                    <span class="fw-bold text-primary">S/. {{service.price}}</span>
                  </div>
                  <button class="btn btn-outline-primary btn-sm rounded-pill px-3 fw-bold transition-all">
                    Saber Más
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="text-center mt-5">
          <p class="text-muted">¿No encuentras lo que buscas? <a href="#contacto" class="text-primary fw-bold text-decoration-none">Consúltanos directamente</a></p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .service-card {
      background: #ffffff;
      border: 1px solid rgba(0,0,0,0.03) !important;
    }
    .service-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 30px rgba(0,0,0,0.08) !important;
      border-color: rgba(var(--primary-rgb), 0.2) !important;
    }
    .smaller { font-size: 0.7rem; }
    .service-icon-box {
      transition: all 0.3s ease;
    }
    .service-card:hover .service-icon-box {
      background-color: var(--primary-color) !important;
      color: white !important;
      transform: rotate(5deg) scale(1.1);
    }
  `]
})
export class ServicesComponent {
  services = [
    { title: 'Ortodoncia', description: 'Corrección de posición dental con brackets tradicionales o alineadores invisibles de alta tecnología.', price: '1,500', icon: 'align-center' },
    { title: 'Implantes', description: 'Restauración permanente de piezas dentales con materiales biocompatibles y cirugía guiada.', price: '2,800', icon: 'anchor' },
    { title: 'Estética Dental', description: 'Diseño de sonrisa, carillas de porcelana y blanqueamiento láser para un resultado natural.', price: '800', icon: 'sparkles' },
    { title: 'Odontopediatría', description: 'Cuidado especializado para niños en un ambiente cómodo, divertido y libre de miedos.', price: '120', icon: 'baby' },
    { title: 'Endodoncia', description: 'Tratamientos de conducto indoloros para salvar piezas dentales comprometidas.', price: '450', icon: 'activity' },
    { title: 'Periodoncia', description: 'Cuidado integral de las encías y tejidos de soporte para prevenir la pérdida dental.', price: '250', icon: 'shield-check' },
    { title: 'Cirugía Oral', description: 'Extracciones complejas y muelas del juicio con técnicas de mínima invasión.', price: '300', icon: 'scissors' },
    { title: 'Rehabilitación', description: 'Prótesis fijas y removibles para devolver la funcionalidad total a tu mordida.', price: '1,200', icon: 'layers' }
  ];
}
