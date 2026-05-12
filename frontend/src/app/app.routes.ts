import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { MainLayoutComponent } from './components/layout/main-layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { AppointmentListComponent } from './components/appointments/appointment-list/appointment-list.component';
import { PaymentListComponent } from './components/payments/payment-list/payment-list.component';
import { authGuard } from './auth.guard';
import { LandingPageComponent } from './components/landing/landing-page.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UserListComponent, data: { roles: [1] } },
      { path: 'appointments', component: AppointmentListComponent },
      { path: 'payments', component: PaymentListComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];

