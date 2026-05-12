import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="equipo" class="py-5 bg-white">
      <div class="container py-lg-5">
        <div class="section-title text-center mb-5">
          <span class="text-primary fw-bold text-uppercase small tracking-wider">Expertos</span>
          <h2 class="display-5 fw-bold mt-2">Equipo Médico</h2>
          <p class="lead text-muted mx-auto" style="max-width: 600px;">Profesionales certificados comprometidos con la excelencia y tu bienestar dental.</p>
        </div>
        
        <div class="row g-4 justify-content-center">
          <div class="col-md-6 col-lg-4" *ngFor="let member of team">
            <div class="card border-0 team-card h-100 shadow-sm">
              <div class="card-body text-center p-4">
                <div class="team-avatar-wrapper mb-4">
                  <img [src]="member.image" [alt]="member.name" class="team-avatar-img">
                </div>
                <h3 class="h5 fw-bold mb-1">{{member.name}}</h3>
                <p class="text-primary small fw-bold text-uppercase mb-3 tracking-wide">{{member.role}}</p>
                <p class="text-muted small mb-3">{{member.description}}</p>
                <div class="d-flex justify-content-center gap-3 team-social-links">
                  <a href="#" class="social-link"><i class="fab fa-linkedin-in"></i></a>
                  <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>


  `
})
export class TeamComponent {
  team = [
    { name: 'Dra. Carolay', role: 'Ortodoncista', description: 'Especializada en ortodoncia invisible y tratamientos para adultos.', image: 'assets/img/doctoraCarolay.png' },
    { name: 'Dr. Diego Quispe', role: 'Ortodoncia', description: 'Experto en rehabilitación oral.', image: 'assets/img/digoquispe.png' },
    { name: 'Dra. Delina Roshi', role: 'Odontopediatra', description: 'Especialista en cuidado dental infantil con enfoque lúdico.', image: 'assets/img/delinaros.png' }
  ];
}
