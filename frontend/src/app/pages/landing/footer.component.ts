import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <footer class="bg-dark text-white pt-5 pb-4">
      <div class="container pt-lg-4">
        <div class="row g-5">
          <!-- Brand and About -->
          <div class="col-lg-4 col-md-6">
            <div class="bg-white p-2 rounded-3 shadow-sm d-inline-block mb-4">
              <img src="assets/img/imagenesClinica/logoClinica.png" alt="ZAZDENT" width="160">
            </div>
            <p class="text-white-50 mb-4 pe-lg-4">
              Excelencia odontológica con base tecnológica. Cuidamos tu salud dental con los estándares más altos de calidad y profesionalismo.
            </p>
            <div class="d-flex gap-3">
              <a href="#" class="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center shadow-none p-2" style="width: 38px; height: 38px;">
                <lucide-icon name="facebook" [size]="18"></lucide-icon>
              </a>
              <a href="#" class="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center shadow-none p-2" style="width: 38px; height: 38px;">
                <lucide-icon name="instagram" [size]="18"></lucide-icon>
              </a>
              <a href="#" class="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center shadow-none p-2" style="width: 38px; height: 38px;">
                <lucide-icon name="twitter" [size]="18"></lucide-icon>
              </a>
            </div>
          </div>
          
          <!-- Quick Links -->
          <div class="col-lg-2 col-md-6 col-6">
            <h5 class="fw-bold mb-4 small text-uppercase tracking-wider">Navegación</h5>
            <ul class="nav flex-column gap-2">
              <li class="nav-item"><a href="#" class="nav-link p-0 text-white-50 footer-link">Inicio</a></li>
              <li class="nav-item"><a href="#servicios" class="nav-link p-0 text-white-50 footer-link">Servicios</a></li>
              <li class="nav-item"><a href="#nosotros" class="nav-link p-0 text-white-50 footer-link">Nosotros</a></li>
              <li class="nav-item"><a href="#equipo" class="nav-link p-0 text-white-50 footer-link">Equipo</a></li>
              <li class="nav-item"><a href="#testimonios" class="nav-link p-0 text-white-50 footer-link">Testimonios</a></li>
            </ul>
          </div>
          
          <!-- Treatments -->
          <div class="col-lg-2 col-md-6 col-6">
            <h5 class="fw-bold mb-4 small text-uppercase tracking-wider">Tratamientos</h5>
            <ul class="nav flex-column gap-2">
              <li class="nav-item"><a href="#" class="nav-link p-0 text-white-50 footer-link">Ortodoncia</a></li>
              <li class="nav-item"><a href="#" class="nav-link p-0 text-white-50 footer-link">Implantes</a></li>
              <li class="nav-item"><a href="#" class="nav-link p-0 text-white-50 footer-link">Estética</a></li>
              <li class="nav-item"><a href="#" class="nav-link p-0 text-white-50 footer-link">Niños</a></li>
              <li class="nav-item"><a href="#" class="nav-link p-0 text-white-50 footer-link">Endodoncia</a></li>
            </ul>
          </div>
          
          <!-- Contact -->
          <div class="col-lg-4 col-md-6">
            <h5 class="fw-bold mb-4 small text-uppercase tracking-wider">Suscripción</h5>
            <p class="text-white-50 small mb-4">Únete a nuestra comunidad para recibir consejos de salud y ofertas exclusivas.</p>
            <div class="input-group mb-3">
              <input type="email" class="form-control bg-white bg-opacity-10 border-0 text-white shadow-none" placeholder="Tu correo electrónico" style="padding: 12px;">
              <button class="btn btn-primary px-4 fw-bold" type="button">Unirse</button>
            </div>
            <div class="mt-4 pt-2">
              <div class="d-flex align-items-center gap-2 text-white-50 small">
                <lucide-icon name="map-pin" [size]="14"></lucide-icon>
                <span>San Borja, Lima, Perú</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="border-top border-white border-opacity-10 mt-5 pt-4">
          <div class="row align-items-center g-3">
            <div class="col-md text-center text-md-start">
              <p class="mb-0 small text-white-50">&copy; 2024 ZAZDENT Clínica Dental. Todos los derechos reservados.</p>
            </div>
            <div class="col-md-auto text-center">
              <div class="d-flex gap-4 justify-content-center justify-content-md-end">
                <a href="#" class="text-white-50 small text-decoration-none footer-link">Privacidad</a>
                <a href="#" class="text-white-50 small text-decoration-none footer-link">Términos</a>
                <a href="#" class="text-white-50 small text-decoration-none footer-link">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer-link {
      transition: all 0.2s ease;
    }
    .footer-link:hover {
      color: var(--accent-color) !important;
      transform: translateX(5px);
    }
    .nav-link {
      width: fit-content;
    }
  `]
})
export class FooterComponent {}
