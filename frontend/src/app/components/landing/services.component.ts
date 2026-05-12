import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="servicios" class="py-5 bg-white">
      <div class="container py-lg-5">
        <div class="section-title text-center mb-5">
          <span class="text-primary fw-bold text-uppercase small tracking-wider">Tratamientos</span>
          <h2 class="display-5 fw-bold mt-2">Nuestra Especialidad</h2>
          <p class="lead text-muted mx-auto" style="max-width: 600px;">Soluciones dentales integrales diseñadas para cada miembro de tu familia con tecnología de punta.</p>
        </div>
        
        <div class="row g-4">
          <div class="col-md-6 col-lg-3" *ngFor="let service of services">
            <div class="card service-card h-100 border-0 shadow-sm">
              <div class="card-body p-3">
                <div class="service-icon mb-4">
                  <img [src]="service.image" [alt]="service.title" class="img-fluid w-100">
                </div>
                <div class="p-2">
                  <h3 class="h5 fw-bold">{{service.title}}</h3>
                  <p class="text-muted small mb-3">{{service.description}}</p>
                  <div class="d-flex align-items-center justify-content-between mt-auto">
                    <div class="price-tag">
                      $<span>{{service.price}}</span>
                    </div>
                    <button class="btn btn-link text-primary p-0"><i class="fas fa-arrow-right"></i></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="text-center mt-5">
          <a href="#" class="btn btn-outline-primary btn-lg px-5 rounded-pill fw-bold">Descubrir todos los servicios</a>
        </div>
      </div>
    </section>

  `
})
export class ServicesComponent {
  services = [
    { title: 'Consulta Dental', description: 'Evaluación clínica completa con diagnóstico y plan de tratamiento.', price: '300.00', image: 'assets/img/consultaMedica.jpg' },
    { title: 'Limpieza Dental', description: 'Remoción de sarro, placa bacteriana y pulido dental profesional.', price: '500.00', image: 'assets/img/blanqueamiento.jpg' },
    { title: 'Ortodoncia Metálica', description: 'Tratamiento integral con brackets metálicos incluyendo controles mensuales.', price: '8000.00', image: 'assets/img/braces.jpg' },
    { title: 'Endodoncia', description: 'Tratamiento de conducto en dientes con una sola raíz.', price: '2500.00', image: 'assets/img/endoncia.jpg' },
    { title: 'Implantes Dentales', description: 'Colocación de implante dental y corona protésica sobre implante.', price: '1800.00', image: 'assets/img/reabilitaciondental.jpg' },
    { title: 'Extracción Dental', description: 'Exodoncia de pieza dentaria sin complicaciones quirúrgicas.', price: '800.00', image: 'assets/img/extracionDental.jpg' },
    { title: 'Odontopediatría', description: 'Consulta preventiva y aplicación de sellantes en pacientes infantiles.', price: '800.00', image: 'assets/img/odontopediatria.jpg' },
    { title: 'Periodoncia', description: 'Raspado y alisado radicular en un cuadrante de la boca.', price: '800.00', image: 'assets/img/blanqueamientoDental.jpg' }
  ];
}
