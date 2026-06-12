import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <div class="sidebar-container d-flex flex-column h-100" [attr.collapsed]="collapsed">
      <!-- Brand -->
      <div class="sidebar-header d-flex align-items-center border-bottom border-white border-opacity-10"
           [class.justify-content-center]="collapsed"
           [class.px-3]="!collapsed"
           [class.px-2]="collapsed">
        <div class="brand-icon d-flex align-items-center justify-content-center flex-shrink-0">
          <span class="fs-4">🦷</span>
        </div>
        <span class="brand-text fw-bold fs-5 text-white ms-2 text-nowrap" *ngIf="!collapsed">ZAZDENT</span>
      </div>

      <!-- Navigation -->
      <nav class="flex-grow-1 py-3 d-flex flex-column gap-1 overflow-auto"
           [class.px-2]="!collapsed"
           [class.px-1]="collapsed">

        <a routerLink="/app/dashboard" routerLinkActive="active"
           *ngIf="isAdmin()"
           class="nav-link-item d-flex align-items-center rounded-3 text-decoration-none"
           [class.justify-content-center]="collapsed"
           [title]="collapsed ? 'Dashboard' : ''">
          <div class="icon-box d-flex align-items-center justify-content-center flex-shrink-0">
            <lucide-icon name="layout-dashboard" [size]="20"></lucide-icon>
          </div>
          <span class="label-text ms-3 fw-medium text-nowrap" *ngIf="!collapsed">Dashboard</span>
        </a>

        <a routerLink="/app/users" routerLinkActive="active"
           *ngIf="isAdmin()"
           class="nav-link-item d-flex align-items-center rounded-3 text-decoration-none"
           [class.justify-content-center]="collapsed"
           [title]="collapsed ? 'Usuarios' : ''">
          <div class="icon-box d-flex align-items-center justify-content-center flex-shrink-0">
            <lucide-icon name="users" [size]="20"></lucide-icon>
          </div>
          <span class="label-text ms-3 fw-medium text-nowrap" *ngIf="!collapsed">Usuarios</span>
        </a>

        <a routerLink="/app/appointments" routerLinkActive="active"
           *ngIf="isAdmin() || isReception()"
           class="nav-link-item d-flex align-items-center rounded-3 text-decoration-none"
           [class.justify-content-center]="collapsed"
           [title]="collapsed ? 'Citas' : ''">
          <div class="icon-box d-flex align-items-center justify-content-center flex-shrink-0">
            <lucide-icon name="calendar" [size]="20"></lucide-icon>
          </div>
          <span class="label-text ms-3 fw-medium text-nowrap" *ngIf="!collapsed">Citas</span>
        </a>

        <a routerLink="/app/payments" routerLinkActive="active"
           *ngIf="isAdmin() || isReception()"
           class="nav-link-item d-flex align-items-center rounded-3 text-decoration-none"
           [class.justify-content-center]="collapsed"
           [title]="collapsed ? 'Pagos' : ''">
          <div class="icon-box d-flex align-items-center justify-content-center flex-shrink-0">
            <lucide-icon name="credit-card" [size]="20"></lucide-icon>
          </div>
          <span class="label-text ms-3 fw-medium text-nowrap" *ngIf="!collapsed">Pagos</span>
        </a>

        <!-- Nuevo Menú: Dentista -->
        <a routerLink="/app/dentist-schedule" routerLinkActive="active"
           *ngIf="isDentist()"
           class="nav-link-item d-flex align-items-center rounded-3 text-decoration-none"
           [class.justify-content-center]="collapsed"
           [title]="collapsed ? 'Citas del Día' : ''">
          <div class="icon-box d-flex align-items-center justify-content-center flex-shrink-0">
            <lucide-icon name="calendar-clock" [size]="20"></lucide-icon>
          </div>
          <span class="label-text ms-3 fw-medium text-nowrap" *ngIf="!collapsed">Citas del Día</span>
        </a>

        <!-- Nuevo Menú: Paciente -->
        <a routerLink="/app/my-appointments" routerLinkActive="active"
           *ngIf="isPatient()"
           class="nav-link-item d-flex align-items-center rounded-3 text-decoration-none"
           [class.justify-content-center]="collapsed"
           [title]="collapsed ? 'Mis Citas' : ''">
          <div class="icon-box d-flex align-items-center justify-content-center flex-shrink-0">
            <lucide-icon name="calendar-heart" [size]="20"></lucide-icon>
          </div>
          <span class="label-text ms-3 fw-medium text-nowrap" *ngIf="!collapsed">Mis Citas</span>
        </a>
      </nav>

      <!-- Footer -->
      <div class="p-2 border-top border-white border-opacity-10">
        <a (click)="onLogout()" 
           class="nav-link-item logout-item d-flex align-items-center rounded-3 text-decoration-none cursor-pointer"
           [class.justify-content-center]="collapsed"
           [title]="collapsed ? 'Cerrar Sesión' : ''">
          <div class="icon-box d-flex align-items-center justify-content-center flex-shrink-0">
            <lucide-icon name="log-out" [size]="20"></lucide-icon>
          </div>
          <span class="label-text ms-3 fw-medium text-nowrap" *ngIf="!collapsed">Cerrar Sesión</span>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .sidebar-container {
      background: #0f172a;
      overflow: hidden;
    }

    .sidebar-header {
      height: 64px;
    }

    .brand-icon {
      width: 36px;
      height: 36px;
    }

    .icon-box {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      transition: background 0.2s;
    }

    .nav-link-item {
      height: 44px;
      padding: 0 12px;
      color: #94a3b8;
      transition: all 0.2s ease;
      cursor: pointer;
      width: 100%;
    }

    .sidebar-container[collapsed="true"] .nav-link-item {
      padding: 0;
    }

    .nav-link-item:hover {
      background: rgba(255, 255, 255, 0.06);
      color: #f1f5f9;
    }

    .nav-link-item.active {
      background: #3b82f6;
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .nav-link-item.active .icon-box {
      color: #ffffff;
    }

    .label-text {
      font-size: 0.875rem;
    }

    .logout-item:hover {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }

    .cursor-pointer {
      cursor: pointer;
    }
  `]
})
export class SidebarComponent {
  @Input() collapsed = false;

  constructor(private authService: AuthService) {}

  isAdmin() { return this.authService.hasRole([1]); }
  isDentist() { return this.authService.hasRole([2]); }
  isReception() { return this.authService.hasRole([3]); }
  isPatient() { return this.authService.hasRole([4]); }

  onLogout() {
    this.authService.logout();
  }
}
