import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, NavbarComponent],
  template: `
    <div class="vh-100 overflow-hidden">
      <div class="container-fluid h-100 p-0">
        <div class="row g-0 h-100 flex-nowrap">
          <!-- Sidebar Column -->
          <aside class="col-auto h-100 sidebar-wrapper bg-dark border-end"
                 [class.collapsed]="isCollapsed"
                 [class.mobile-open]="mobileOpen">
            <app-sidebar [collapsed]="isCollapsed"></app-sidebar>
          </aside>

          <!-- Mobile backdrop -->
          <div class="sidebar-backdrop" 
               *ngIf="mobileOpen" 
               (click)="mobileOpen = false"></div>

          <!-- Content Column -->
          <div class="col h-100 d-flex flex-column min-w-0 overflow-hidden">
            <header class="flex-shrink-0 border-bottom bg-white shadow-sm position-relative" style="z-index: 10;">
              <app-navbar (toggleSidebar)="onToggleSidebar()"></app-navbar>
            </header>

            <main class="flex-grow-1 overflow-auto p-4 bg-light" style="scrollbar-gutter: stable;">
              <div class="container-fluid p-0">
                <router-outlet></router-outlet>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sidebar-wrapper {
      width: 260px;
      background: #0f172a;
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
    }

    .sidebar-wrapper.collapsed {
      width: 72px;
    }

    /* Mobile sidebar */
    @media (max-width: 768px) {
      .sidebar-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 260px;
        z-index: 1050;
        transform: translateX(-100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .sidebar-wrapper.mobile-open {
        transform: translateX(0);
      }

      .sidebar-wrapper.collapsed {
        width: 260px;
        transform: translateX(-100%);
      }

      .sidebar-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        z-index: 1040;
        backdrop-filter: blur(2px);
      }
    }
  `]
})
export class MainLayoutComponent {
  isCollapsed = false;
  mobileOpen = false;

  onToggleSidebar(): void {
    if (window.innerWidth <= 768) {
      this.mobileOpen = !this.mobileOpen;
    } else {
      this.isCollapsed = !this.isCollapsed;
    }
  }
}
