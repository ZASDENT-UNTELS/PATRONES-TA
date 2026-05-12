import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardStats } from '../../services/dashboard.service';
import { LucideAngularModule } from 'lucide-angular';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, MatCardModule],
  template: `
    <div class="dashboard-container">
      <div class="header-section">
        <h1 class="medical-title">Panel de Control</h1>
        <p class="text-muted">Resumen general del consultorio para hoy</p>
      </div>

      <div class="stats-grid" *ngIf="stats">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon bg-blue">
              <lucide-icon name="calendar"></lucide-icon>
            </div>
            <div class="stat-data">
              <h3>{{ stats.citasHoy }}</h3>
              <p>Citas para Hoy</p>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon bg-green">
              <lucide-icon name="users"></lucide-icon>
            </div>
            <div class="stat-data">
              <h3>{{ stats.totalPacientes }}</h3>
              <p>Pacientes Totales</p>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon bg-purple">
              <lucide-icon name="activity"></lucide-icon>
            </div>
            <div class="stat-data">
              <h3>{{ stats.totalDentistas }}</h3>
              <p>Dentistas Activos</p>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon bg-orange">
              <lucide-icon name="dollar-sign"></lucide-icon>
            </div>
            <div class="stat-data">
              <h3>S/. {{ stats.ingresosEsteMes | number:'1.2-2' }}</h3>
              <p>Ingresos del Mes</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="row mt-4">
        <div class="col-12">
          <mat-card class="medical-card">
            <mat-card-header>
              <mat-card-title>Bienvenidos a ZAZDENT v2.0</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="features-list">
                <div class="feature-item">
                  <span class="dot"></span> Gestión centralizada de pacientes
                </div>
                <div class="feature-item">
                  <span class="dot"></span> Agenda inteligente de citas
                </div>
                <div class="feature-item">
                  <span class="dot"></span> Reportes financieros en tiempo real
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .header-section { margin-bottom: 32px; }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 24px;
    }
    .stat-card { border-radius: 16px; border: 1px solid #e2e8f0; }
    .stat-card mat-card-content {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 24px !important;
    }
    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    .stat-icon lucide-icon { width: 28px; height: 28px; }
    
    .bg-blue { background: #1E88E5; }
    .bg-green { background: #10b981; }
    .bg-purple { background: #8b5cf6; }
    .bg-orange { background: #f59e0b; }
    
    .stat-data h3 { font-size: 28px; font-weight: 800; margin: 0; color: var(--text-main); }
    .stat-data p { margin: 0; color: var(--text-muted); font-weight: 500; font-size: 14px; }
    
    .features-list { margin-top: 16px; display: flex; flex-direction: column; gap: 8px; }
    .feature-item { display: flex; align-items: center; gap: 12px; font-weight: 500; color: var(--text-main); }
    .dot { width: 8px; height: 8px; background: var(--primary-color); border-radius: 50%; }
    .mt-4 { margin-top: 24px; }
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
