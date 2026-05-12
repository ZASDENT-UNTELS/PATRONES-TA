import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="nosotros" class="py-5" style="background-color: #fafcfd;">
      <div class="container py-lg-5">
        <div class="row align-items-center gx-lg-5">
          <div class="col-lg-6 mb-5 mb-lg-0">
            <div class="position-relative">
              <div class="about-img-decor"></div>
              <img src="assets/img/imagenesClinica/foto.png" alt="Clínica ZAZDENT" class="img-fluid rounded-4 shadow-lg position-relative z-1">
              <div class="experience-badge shadow-lg">
                <span class="h2 fw-bold d-block mb-0">15+</span>
                <span class="small text-uppercase fw-bold">Años de Excelencia</span>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <span class="text-primary fw-bold text-uppercase small tracking-wider">Conoce la Clínica</span>
            <h2 class="display-5 fw-bold mb-4 mt-2">Tecnología y Cuidado <br> en un solo lugar</h2>
            <p class="lead text-muted mb-4">Desde 2023, ZAZDENT redefine la experiencia odontológica combinando tecnología digital de vanguardia con un trato cálido y personalizado.</p>
            
            <div class="row g-4 mb-5">
              <div class="col-sm-6">
                <div class="d-flex align-items-start gap-3">
                  <div class="bg-primary-light p-2 rounded-3 text-primary">
                    <i class="fas fa-microscope fa-lg"></i>
                  </div>
                  <div>
                    <h4 class="h6 fw-bold mb-1">Tecnología Digital</h4>
                    <p class="small text-muted mb-0">Escaneo 3D y diagnósticos precisos.</p>
                  </div>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="d-flex align-items-start gap-3">
                  <div class="bg-primary-light p-2 rounded-3 text-primary">
                    <i class="fas fa-heart fa-lg"></i>
                  </div>
                  <div>
                    <h4 class="h6 fw-bold mb-1">Enfoque Humano</h4>
                    <p class="small text-muted mb-0">Tratamientos libres de estrés.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <a href="#contacto" class="btn btn-primary btn-lg rounded-pill px-4 fw-bold">Más sobre nosotros</a>
          </div>
        </div>
      </div>
    </section>
    <style>
      .bg-primary-light { background-color: rgba(15, 76, 129, 0.1); }
      .experience-badge {
        position: absolute;
        bottom: -20px;
        right: -20px;
        background: var(--primary-color);
        color: white;
        padding: 25px;
        border-radius: 20px;
        z-index: 2;
        text-align: center;
      }
      .about-img-decor {
        position: absolute;
        top: -30px;
        left: -30px;
        width: 100px;
        height: 100px;
        background: radial-gradient(var(--accent-color) 0%, transparent 70%);
        opacity: 0.2;
        z-index: 0;
      }
    </style>

  `
})
export class AboutComponent {}
