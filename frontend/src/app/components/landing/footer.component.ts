import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="row g-5">
          <div class="col-lg-4">
            <div class="footer-logo-container mb-4">
              <img src="assets/img/imagenesClinica/logoClinica.png" alt="ZAZDENT" width="180">
            </div>
            <p class="mb-4">Excelencia en odontología moderna. Combinamos arte y ciencia para crear la sonrisa que siempre soñaste.</p>

            <div class="d-flex gap-3">
              <a href="#" class="social-icon"><i class="fab fa-facebook-f"></i></a>
              <a href="#" class="social-icon"><i class="fab fa-instagram"></i></a>
              <a href="#" class="social-icon"><i class="fab fa-whatsapp"></i></a>
              <a href="#" class="social-icon"><i class="fab fa-linkedin-in"></i></a>
            </div>
          </div>
          
          <div class="col-lg-2 col-md-4">
            <h5 class="fw-bold">Navegación</h5>
            <ul class="nav flex-column">
              <li class="nav-item mb-2"><a href="#servicios" class="nav-link p-0">Servicios</a></li>
              <li class="nav-item mb-2"><a href="#nosotros" class="nav-link p-0">Nosotros</a></li>
              <li class="nav-item mb-2"><a href="#equipo" class="nav-link p-0">Equipo</a></li>
              <li class="nav-item mb-2"><a href="#testimonios" class="nav-link p-0">Testimonios</a></li>
            </ul>
          </div>
          
          <div class="col-lg-2 col-md-4">
            <h5 class="fw-bold">Tratamientos</h5>
            <ul class="nav flex-column">
              <li class="nav-item mb-2"><a href="#" class="nav-link p-0">Ortodoncia</a></li>
              <li class="nav-item mb-2"><a href="#" class="nav-link p-0">Implantes</a></li>
              <li class="nav-item mb-2"><a href="#" class="nav-link p-0">Estética</a></li>
              <li class="nav-item mb-2"><a href="#" class="nav-link p-0">Niños</a></li>
            </ul>
          </div>
          
          <div class="col-lg-4 col-md-4">
            <h5 class="fw-bold">Newsletter</h5>
            <p class="small mb-4">Suscríbete para recibir consejos de salud dental y promociones exclusivas.</p>
            <div class="input-group mb-3">
              <input type="text" class="form-control bg-dark border-0 text-white" placeholder="Tu email" style="padding: 12px;">
              <button class="btn btn-primary px-3" type="button">Unirse</button>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom border-top border-white border-opacity-10 mt-5 pt-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <p class="mb-0 small">&copy; 2023 ZAZDENT Clínica Dental. Todos los derechos reservados.</p>
          <div class="d-flex gap-4">
            <a href="#" class="text-white-50 small text-decoration-none hover-white">Privacidad</a>
            <a href="#" class="text-white-50 small text-decoration-none hover-white">Términos</a>
            <a href="#" class="text-white-50 small text-decoration-none hover-white">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
    <style>
      .footer-logo-container {
        display: inline-block;
        padding: 10px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      }
      .hover-white:hover { color: white !important; }
    </style>


  `
})
export class FooterComponent {}
