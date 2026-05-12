import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, LucideAngularModule],
  template: `
    <mat-toolbar class="navbar">
      <button mat-icon-button (click)="toggleSidebar.emit()">
        <lucide-icon name="menu"></lucide-icon>
      </button>
      
      <span class="spacer"></span>

      <div class="nav-actions">
        <button mat-icon-button class="notification-btn">
          <lucide-icon name="bell"></lucide-icon>
          <span class="badge"></span>
        </button>

        <button mat-button [matMenuTriggerFor]="userMenu" class="user-profile">
          <div class="user-avatar">
            <lucide-icon name="user"></lucide-icon>
          </div>
          <div class="user-meta" *ngIf="user()">
            <span class="username">{{ user()?.nombre }}</span>
            <span class="user-role">{{ user()?.rol }}</span>
          </div>
        </button>

        <mat-menu #userMenu="matMenu">
          <button mat-menu-item>
            <mat-icon>person</mat-icon>
            <span>Mi Perfil</span>
          </button>
          <button mat-menu-item (click)="onLogout()">
            <mat-icon>exit_to_app</mat-icon>
            <span>Cerrar Sesión</span>
          </button>
        </mat-menu>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .navbar {
      background: white;
      border-bottom: 1px solid #e2e8f0;
      padding: 0 24px;
      height: 64px;
      display: flex;
    }
    .spacer { flex: 1 1 auto; }
    .nav-actions { display: flex; align-items: center; gap: 16px; }
    .user-profile {
      display: flex;
      align-items: center;
      gap: 12px;
      height: 48px;
      padding: 0 8px;
      border-radius: 8px;
    }
    .user-avatar {
      width: 36px;
      height: 36px;
      background: var(--accent-color);
      color: var(--primary-color);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .user-meta {
      display: flex;
      flex-direction: column;
      text-align: left;
      line-height: 1.2;
    }
    .username { font-weight: 600; font-size: 14px; color: var(--text-main); }
    .user-role { font-size: 11px; color: var(--text-muted); text-transform: uppercase; }
    
    .notification-btn { position: relative; color: var(--text-muted); }
    .badge {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 8px;
      height: 8px;
      background: var(--danger-color);
      border-radius: 50%;
      border: 2px solid white;
    }
  `]
})
export class NavbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  
  private authService = inject(AuthService);
  user = this.authService.currentUser;

  onLogout() {
    this.authService.logout();
  }
}
