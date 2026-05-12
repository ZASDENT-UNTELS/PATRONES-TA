import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-light fixed-top">
      <div class="container">
        <a class="navbar-brand" routerLink="/">
          <img src="assets/img/imagenesClinica/logoClinica.png" alt="ZAZDENT">
        </a>
        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item"><a class="nav-link" href="#servicios">Servicios</a></li>
            <li class="nav-item"><a class="nav-link" href="#nosotros">Nosotros</a></li>
            <li class="nav-item"><a class="nav-link" href="#equipo">Equipo</a></li>
            <li class="nav-item"><a class="nav-link" href="#testimonios">Testimonios</a></li>
            <li class="nav-item"><a class="nav-link" href="#contacto">Contacto</a></li>
          </ul>
          <div class="ms-lg-4 mt-3 mt-lg-0">
            <a routerLink="/login" class="btn-login">Acceso Cliente</a>
          </div>
        </div>
      </div>
    </nav>

  `
})
export class NavbarComponent {}
