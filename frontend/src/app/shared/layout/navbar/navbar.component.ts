import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="d-flex align-items-center justify-content-between px-4 bg-white border-bottom shadow-sm" style="height: 64px;">
      <!-- Left section -->
      <div class="d-flex align-items-center gap-3">
        <button class="btn btn-light btn-sm rounded-3 p-2 text-secondary border-0 shadow-none"
                (click)="toggleSidebar.emit()">
          <lucide-icon name="menu" [size]="20"></lucide-icon>
        </button>
        <span class="text-muted small fw-bold d-none d-md-inline tracking-tight">ZAZDENT ADMIN</span>
      </div>

      <!-- Right section -->
      <div class="d-flex align-items-center gap-3">
        <!-- Notifications -->
        <button class="btn btn-light btn-sm border-0 rounded-circle p-2 text-secondary position-relative shadow-none" style="width: 38px; height: 38px;">
          <lucide-icon name="bell" [size]="20"></lucide-icon>
          <span class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
                style="margin-left: -8px; margin-top: 8px;"></span>
        </button>

        <!-- User profile dropdown -->
        <div class="dropdown">
          <button class="btn btn-light d-flex align-items-center gap-2 rounded-pill border py-1 px-2 shadow-none" 
                  type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <div class="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                 style="width: 32px; height: 32px;">
              <lucide-icon name="user" [size]="16"></lucide-icon>
            </div>
            <div class="text-start d-none d-sm-block pe-2" *ngIf="user()">
              <div class="fw-bold text-dark lh-1" style="font-size: 0.75rem;">{{ user()?.nombre }}</div>
              <div class="text-muted lh-1 mt-1" style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.02em;">{{ user()?.rol }}</div>
            </div>
          </button>
          
          <ul class="dropdown-menu dropdown-menu-end shadow border-0 p-2 mt-2 rounded-3">
            <li>
              <button class="dropdown-item d-flex align-items-center gap-2 rounded-2 py-2">
                <lucide-icon name="user" class="text-muted" [size]="18"></lucide-icon>
                <span class="small fw-medium">Mi Perfil</span>
              </button>
            </li>
            <li><hr class="dropdown-divider opacity-10"></li>
            <li>
              <button class="dropdown-item d-flex align-items-center gap-2 rounded-2 py-2 text-danger" (click)="onLogout()">
                <lucide-icon name="log-out" [size]="18"></lucide-icon>
                <span class="small fw-bold">Cerrar Sesión</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .dropdown-item:active { background-color: var(--primary-color); }
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
