import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, RouterModule, LucideAngularModule],
  template: `
    <div class="sidebar-container" [class.collapsed]="collapsed">
      <div class="sidebar-header">
        <span class="logo-icon">🦷</span>
        <span class="logo-text" *ngIf="!collapsed">ZAZDENT</span>
      </div>

      <mat-nav-list>
        <a mat-list-item routerLink="/dashboard" routerLinkActive="active-link">
          <lucide-icon name="layout-dashboard" class="nav-icon"></lucide-icon>
          <span class="nav-label" *ngIf="!collapsed">Dashboard</span>
        </a>
        
        <a mat-list-item routerLink="/users" routerLinkActive="active-link" *ngIf="isAdmin()">
          <lucide-icon name="users" class="nav-icon"></lucide-icon>
          <span class="nav-label" *ngIf="!collapsed">Usuarios</span>
        </a>

        <a mat-list-item routerLink="/appointments" routerLinkActive="active-link">
          <lucide-icon name="calendar" class="nav-icon"></lucide-icon>
          <span class="nav-label" *ngIf="!collapsed">Citas</span>
        </a>

        <a mat-list-item routerLink="/payments" routerLinkActive="active-link" *ngIf="isAdmin() || isReception()">
          <lucide-icon name="credit-card" class="nav-icon"></lucide-icon>
          <span class="nav-label" *ngIf="!collapsed">Pagos</span>
        </a>

        <div class="sidebar-footer">
          <a mat-list-item (click)="onLogout()">
            <lucide-icon name="log-out" class="nav-icon logout-icon"></lucide-icon>
            <span class="nav-label" *ngIf="!collapsed">Cerrar Sesión</span>
          </a>
        </div>
      </mat-nav-list>
    </div>
  `,
  styles: [`
    .sidebar-container {
      width: 260px;
      height: 100%;
      background: #1e293b;
      color: white;
      transition: width 0.3s ease;
      display: flex;
      flex-direction: column;
    }
    .sidebar-container.collapsed {
      width: 80px;
    }
    .sidebar-header {
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .logo-icon { font-size: 24px; }
    .logo-text { font-weight: 800; font-size: 20px; letter-spacing: 1px; }
    
    mat-nav-list { padding-top: 16px; flex: 1; }
    .nav-icon { width: 20px; height: 20px; margin-right: 16px; color: #94a3b8; }
    .sidebar-container.collapsed .nav-icon { margin-right: 0; }
    .nav-label { font-weight: 500; font-size: 14px; color: #94a3b8; }
    
    a.active-link {
      background: var(--primary-color) !important;
      color: white !important;
    }
    a.active-link .nav-icon, a.active-link .nav-label { color: white; }
    
    .sidebar-footer {
      margin-top: auto;
      padding-bottom: 24px;
      border-top: 1px solid rgba(255,255,255,0.1);
    }
    .logout-icon { color: #f87171; }
  `]
})
export class SidebarComponent {
  @Input() collapsed = false;

  constructor(private authService: AuthService) {}

  isAdmin() { return this.authService.hasRole([1]); }
  isReception() { return this.authService.hasRole([3]); }

  onLogout() {
    this.authService.logout();
  }
}
