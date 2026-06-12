import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <section id="equipo" class="py-5 bg-white">
      <div class="container py-lg-5">
        <div class="row justify-content-center mb-5">
          <div class="col-lg-6 text-center">
            <span class="text-primary fw-bold text-uppercase small tracking-wider">Nuestro Equipo</span>
            <h2 class="display-5 fw-bold text-dark mt-2">Expertos en <span class="text-primary">Tu Salud</span></h2>
            <p class="text-muted mt-3">Un equipo multidisciplinario de especialistas certificados con un solo objetivo: tu bienestar.</p>
          </div>
        </div>
        
        <div class="row g-4 justify-content-center">
          <div class="col-md-6 col-lg-4" *ngFor="let member of team">
            <div class="card border-0 h-100 shadow-sm rounded-4 overflow-hidden team-card transition-all">
              <div class="position-relative overflow-hidden bg-light" style="height: 380px;">
                <img [src]="member.image" [alt]="member.name" class="w-100 h-100 object-fit-cover team-img transition-all">
                <div class="team-social-overlay position-absolute bottom-0 start-0 w-100 p-4 d-flex justify-content-center gap-2">
                  <a href="#" class="btn btn-primary rounded-circle shadow-sm d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                    <lucide-icon name="linkedin" [size]="18"></lucide-icon>
                  </a>
                  <a href="#" class="btn btn-primary rounded-circle shadow-sm d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                    <lucide-icon name="instagram" [size]="18"></lucide-icon>
                  </a>
                </div>
              </div>
              <div class="card-body p-4 text-center">
                <h3 class="h5 fw-bold text-dark mb-1">{{member.name}}</h3>
                <p class="text-primary small fw-bold text-uppercase mb-3 tracking-wide">{{member.role}}</p>
                <div class="small text-muted mb-0 opacity-75">{{member.description}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .team-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important;
    }
    .team-img {
      filter: grayscale(20%);
    }
    .team-card:hover .team-img {
      transform: scale(1.05);
      filter: grayscale(0%);
    }
    .team-social-overlay {
      background: linear-gradient(to top, rgba(15, 76, 129, 0.8), transparent);
      transform: translateY(100%);
      transition: transform 0.3s ease;
    }
    .team-card:hover .team-social-overlay {
      transform: translateY(0);
    }
    .object-fit-cover { object-fit: cover; }
  `]
})
export class TeamComponent {
  team = [
    { 
      name: 'Dra. Carolay', 
      role: 'Directora de Ortodoncia', 
      description: 'Especialista en alineadores invisibles y ortodoncia interceptiva con más de 10 años de experiencia.', 
      image: 'assets/img/doctoraCarolay.png' 
    },
    { 
      name: 'Dr. Diego Quispe', 
      role: 'Especialista en Rehabilitación', 
      description: 'Experto en diseño de sonrisa y prótesis sobre implantes. Magister en odontología restauradora.', 
      image: 'assets/img/digoquispe.png' 
    },
    { 
      name: 'Dra. Delina Roshi', 
      role: 'Odontopediatría', 
      description: 'Dedicada al cuidado de los más pequeños con un enfoque preventivo y mínimamente invasivo.', 
      image: 'assets/img/delinaros.png' 
    }
  ];
}
