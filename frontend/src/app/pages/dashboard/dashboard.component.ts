import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardStats } from '../../services/dashboard.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="container-fluid p-0">
      <div class="row align-items-center mb-4 g-3">
        <div class="col">
          <h4 class="fw-bold text-dark mb-1">Panel de Control</h4>
          <p class="text-muted small mb-0">Resumen general del consultorio para hoy</p>
        </div>
      </div>

      <div class="row g-4" *ngIf="stats">
        <div class="col-12 col-md-6 col-lg-3">
          <div class="card border-0 shadow-sm rounded-4 h-100">
            <div class="card-body d-flex align-items-center p-4">
              <div class="stat-icon bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center me-3">
                <lucide-icon name="calendar" [size]="24"></lucide-icon>
              </div>
              <div>
                <h3 class="fw-bold mb-0 lh-1">{{ stats.citasHoy }}</h3>
                <p class="text-muted small mb-0 mt-1 fw-medium text-uppercase tracking-wider" style="font-size: 0.65rem;">Citas Hoy</p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6 col-lg-3">
          <div class="card border-0 shadow-sm rounded-4 h-100">
            <div class="card-body d-flex align-items-center p-4">
              <div class="stat-icon bg-success bg-opacity-10 text-success rounded-3 d-flex align-items-center justify-content-center me-3">
                <lucide-icon name="users" [size]="24"></lucide-icon>
              </div>
              <div>
                <h3 class="fw-bold mb-0 lh-1">{{ stats.totalPacientes }}</h3>
                <p class="text-muted small mb-0 mt-1 fw-medium text-uppercase tracking-wider" style="font-size: 0.65rem;">Pacientes</p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6 col-lg-3">
          <div class="card border-0 shadow-sm rounded-4 h-100">
            <div class="card-body d-flex align-items-center p-4">
              <div class="stat-icon bg-purple bg-opacity-10 text-purple rounded-3 d-flex align-items-center justify-content-center me-3">
                <lucide-icon name="activity" [size]="24"></lucide-icon>
              </div>
              <div>
                <h3 class="fw-bold mb-0 lh-1">{{ stats.totalDentistas }}</h3>
                <p class="text-muted small mb-0 mt-1 fw-medium text-uppercase tracking-wider" style="font-size: 0.65rem;">Dentistas</p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6 col-lg-3">
          <div class="card border-0 shadow-sm rounded-4 h-100">
            <div class="card-body d-flex align-items-center p-4">
              <div class="stat-icon bg-warning bg-opacity-10 text-warning rounded-3 d-flex align-items-center justify-content-center me-3">
                <lucide-icon name="dollar-sign" [size]="24"></lucide-icon>
              </div>
              <div>
                <h3 class="fw-bold mb-0 lh-1">S/. {{ stats.ingresosEsteMes | number:'1.2-2' }}</h3>
                <p class="text-muted small mb-0 mt-1 fw-medium text-uppercase tracking-wider" style="font-size: 0.65rem;">Ingresos Mes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-4">
        <div class="col-12">
          <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div class="card-header bg-white border-0 pt-4 px-4">
              <h5 class="card-title fw-bold mb-0">Gestión Operativa</h5>
            </div>
            <div class="card-body p-4">
              <div class="row g-4">
                <div class="col-md-4">
                  <div class="d-flex align-items-center gap-3 p-3 rounded-3 border bg-light bg-opacity-50">
                    <div class="bg-primary rounded-circle" style="width: 8px; height: 8px;"></div>
                    <span class="text-secondary fw-semibold small">Pacientes centralizados</span>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="d-flex align-items-center gap-3 p-3 rounded-3 border bg-light bg-opacity-50">
                    <div class="bg-primary rounded-circle" style="width: 8px; height: 8px;"></div>
                    <span class="text-secondary fw-semibold small">Agenda inteligente</span>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="d-flex align-items-center gap-3 p-3 rounded-3 border bg-light bg-opacity-50">
                    <div class="bg-primary rounded-circle" style="width: 8px; height: 8px;"></div>
                    <span class="text-secondary fw-semibold small">Reportes financieros</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stat-icon { width: 48px; height: 48px; }
    .text-purple { color: #8b5cf6; }
    .bg-purple { background-color: #8b5cf6; }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe({
      next: (data) => this.stats = data,
      error: (err) => console.error('Error fetching stats', err)
    });
  }
}
