import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./pages/landing/landing-page.component').then(m => m.LandingPageComponent) 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent) 
  },
  {
    path: 'app',
    loadComponent: () => import('./shared/layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      { 
        path: 'dashboard', 
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
        data: { roles: [1] } // Solo Admin
      },
      { 
        path: 'users', 
        loadComponent: () => import('./pages/users/user-list/user-list.component').then(m => m.UserListComponent),
        data: { roles: [1] } // Solo Admin
      },
      { 
        path: 'appointments', 
        loadComponent: () => import('./pages/appointments/appointment-list/appointment-list.component').then(m => m.AppointmentListComponent),
        data: { roles: [1, 3] } // Admin, Recepcion
      },
      { 
        path: 'payments', 
        loadComponent: () => import('./pages/payments/payment-list/payment-list.component').then(m => m.PaymentListComponent),
        data: { roles: [1, 3] } // Admin, Recepcion
      },
      {
        path: 'dentist-schedule',
        loadComponent: () => import('./pages/appointments/dentist-schedule/dentist-schedule').then(m => m.DentistSchedule),
        data: { roles: [2] } // Solo Dentista
      },
      {
        path: 'my-appointments',
        loadComponent: () => import('./pages/appointments/my-appointments/my-appointments').then(m => m.MyAppointments),
        data: { roles: [4] } // Solo Paciente
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
