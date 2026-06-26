import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg fixed-top transition-all" 
         [class.glass-navbar]="isScrolled"
         [class.py-3]="!isScrolled"
         [class.py-2]="isScrolled"
         [class.bg-white]="!isScrolled && isMobileMenuOpen">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center" routerLink="/">
          <img src="assets/img/imagenesClinica/logoClinica.png" alt="ZAZDENT" height="40" class="d-inline-block align-top">
        </a>
        
        <button class="navbar-toggler border-0 shadow-none" type="button" 
                data-bs-toggle="collapse" data-bs-target="#navbarNav"
                (click)="isMobileMenuOpen = !isMobileMenuOpen">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-3">
            <li class="nav-item">
              <a class="nav-link fw-500 text-dark px-3" href="#servicios">Servicios</a>
            </li>
            <li class="nav-item">
              <a class="nav-link fw-500 text-dark px-3" href="#nosotros">Nosotros</a>
            </li>
            <li class="nav-item">
              <a class="nav-link fw-500 text-dark px-3" href="#equipo">Equipo</a>
            </li>
            <li class="nav-item">
              <a class="nav-link fw-500 text-dark px-3" href="#testimonios">Testimonios</a>
            </li>
            <li class="nav-item">
              <a class="nav-link fw-500 text-dark px-3" href="#contacto">Contacto</a>
            </li>
          </ul>
          
          <div class="d-flex align-items-center gap-3">
            <a routerLink="/login" class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm transition-all">
              Ingreso Sistema
            </a>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .nav-link {
      font-size: 0.95rem;
      position: relative;
      opacity: 0.8;
      transition: opacity 0.2s ease;
    }
    .nav-link:hover {
      opacity: 1;
    }
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 1rem;
      right: 1rem;
      height: 2px;
      background-color: var(--primary-color);
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }
    .nav-link:hover::after {
      transform: scaleX(1);
    }
    .fw-500 { font-weight: 500; }
  `]
})
export class NavbarComponent {
  isScrolled = false;
  isMobileMenuOpen = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }
}
