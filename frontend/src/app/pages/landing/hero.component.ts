import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <section class="hero-section pt-5 pb-5 overflow-hidden">
      <div class="container pt-lg-5 mt-5">
        <div class="row align-items-center g-5">
          <!-- Text Content -->
          <div class="col-lg-6 text-center text-lg-start">
            <div class="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill mb-4 fw-bold tracking-wider small">
              TECNOLOGÍA DENTAL DE VANGUARDIA
            </div>
            <h1 class="display-3 fw-bold text-dark mb-4 tracking-tight">
              Redefiniendo tu <span class="text-primary">Experiencia</span> Dental
            </h1>
            <p class="lead text-muted mb-5 pe-lg-5">
              En ZAZDENT combinamos odontología de alta precisión con un enfoque humano y digital para brindarte la sonrisa que mereces.
            </p>
            <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
              <a href="#contacto" class="btn btn-primary btn-lg rounded-pill px-5 py-3 fw-bold shadow-lg transition-all d-flex align-items-center justify-content-center gap-2">
                Agendar mi Cita <lucide-icon name="arrow-right" [size]="20"></lucide-icon>
              </a>
              <a href="#servicios" class="btn btn-white btn-lg rounded-pill px-5 py-3 fw-bold border transition-all">
                Ver Tratamientos
              </a>
            </div>
            
            <!-- Stats -->
            <div class="row mt-5 pt-4 g-4 justify-content-center justify-content-lg-start">
              <div class="col-auto">
                <div class="d-flex align-items-center gap-2">
                  <div class="fw-bold fs-3 text-dark">5k+</div>
                  <div class="text-muted small lh-1">Pacientes<br>Felices</div>
                </div>
              </div>
              <div class="col-auto">
                <div class="vr h-100 opacity-10 d-none d-sm-block"></div>
              </div>
              <div class="col-auto">
                <div class="d-flex align-items-center gap-2">
                  <div class="fw-bold fs-3 text-dark">15+</div>
                  <div class="text-muted small lh-1">Años de<br>Experiencia</div>
                </div>
              </div>
              <div class="col-auto">
                <div class="vr h-100 opacity-10 d-none d-sm-block"></div>
              </div>
              <div class="col-auto">
                <div class="d-flex align-items-center gap-2">
                  <div class="fw-bold fs-3 text-dark">4.9/5</div>
                  <div class="text-muted small lh-1">Calificación<br>Promedio</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Image Content -->
          <div class="col-lg-6 position-relative">
            <div class="hero-img-bg shadow-sm"></div>
            <img src="assets/img/hero-image.png" alt="Odontología Moderna" 
                 class="img-fluid rounded-5 shadow-lg position-relative z-1 animate-float">
            
            <!-- Floating badge -->
            <div class="position-absolute top-50 start-0 translate-middle-y ms-n4 bg-white p-3 rounded-4 shadow-lg z-2 d-none d-md-block animate-float" style="animation-delay: 1s;">
              <div class="d-flex align-items-center gap-3">
                <div class="bg-success bg-opacity-10 text-success p-2 rounded-circle">
                  <lucide-icon name="check-circle" [size]="24"></lucide-icon>
                </div>
                <div>
                  <div class="fw-bold text-dark small">Escaneo 3D</div>
                  <div class="text-muted smaller">Diagnóstico preciso</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-section {
      background: radial-gradient(circle at 100% 0%, rgba(var(--primary-rgb), 0.05) 0%, transparent 40%),
                  radial-gradient(circle at 0% 100%, rgba(var(--primary-rgb), 0.03) 0%, transparent 40%);
    }
    .hero-img-bg {
      position: absolute;
      top: 10%;
      right: -5%;
      width: 110%;
      height: 80%;
      background-color: var(--primary-color);
      border-radius: 40px;
      opacity: 0.05;
      transform: rotate(-3deg);
    }
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }
    .btn-white {
      background: white;
      color: var(--text-main);
    }
    .btn-white:hover {
      background: #f8fafc;
      transform: translateY(-1px);
    }
    .smaller { font-size: 0.75rem; }
  `]
})
export class HeroComponent {}
