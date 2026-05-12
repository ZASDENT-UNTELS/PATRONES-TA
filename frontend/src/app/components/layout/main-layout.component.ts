import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSidenavModule, SidebarComponent, NavbarComponent],
  template: `
    <mat-sidenav-container class="layout-container">
      <mat-sidenav mode="side" [opened]="true" [class.collapsed]="isCollapsed">
        <app-sidebar [collapsed]="isCollapsed"></app-sidebar>
      </mat-sidenav>
      
      <mat-sidenav-content>
        <app-navbar (toggleSidebar)="isCollapsed = !isCollapsed"></app-navbar>
        <main class="content-area">
          <router-outlet></router-outlet>
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .layout-container { height: 100vh; }
    mat-sidenav { 
      border-right: none; 
      transition: width 0.3s ease; 
      width: 260px;
    }
    mat-sidenav.collapsed { width: 80px; }
    .content-area {
      padding: 32px;
      min-height: calc(100vh - 64px);
    }
  `]
})
export class MainLayoutComponent {
  isCollapsed = false;
}
