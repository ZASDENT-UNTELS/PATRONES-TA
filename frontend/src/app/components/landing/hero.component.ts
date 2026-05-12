import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero-section d-flex align-items-center">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6 mb-5 mb-lg-0">
            <h1 class="hero-title fw-bold mb-4">Sonrisas que <br> transforman vidas</h1>
            <p class="lead mb-5 text-muted" style="font-size: 1.25rem;">Especialistas en odontología avanzada con tecnología de última generación y un enfoque humano excepcional.</p>
            <div class="d-flex flex-wrap gap-3">
              <a href="#contacto" class="btn-cta-primary">Reservar Cita Online</a>
              <a href="tel:+51972205471" class="btn btn-link text-primary text-decoration-none fw-bold p-3">
                <i class="fas fa-phone-alt me-2"></i> +51 972 205 471
              </a>
            </div>
            
            <div class="mt-5 d-flex align-items-center gap-4">
              <div class="d-flex align-items-center">
                <div class="rating me-2">
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                </div>
                <span class="small fw-bold">5.0 (2k+ Reseñas)</span>
              </div>
              <div class="vr h-100 mx-2"></div>
              <span class="small text-muted fw-bold">Certificado por ISO 9001</span>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="position-relative">
              <div class="hero-img-bg"></div>
              <img src="assets/img/dentista.jpg" alt="Dentista en ZAZDENT" class="img-fluid rounded-4 shadow-lg position-relative z-1">
            </div>
          </div>
        </div>
      </div>
    </section>

  `
})
export class HeroComponent {}
