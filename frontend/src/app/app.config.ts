import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { 
  LucideAngularModule,
  LayoutDashboard, Users, Calendar, CreditCard, UserCircle, LogOut, 
  Menu, Bell, User, Search, UserPlus, Edit, Trash2, Activity, DollarSign,
  XCircle
} from 'lucide-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideHttpClient(withFetch()), 
    provideAnimationsAsync(),
    importProvidersFrom(
      LucideAngularModule.pick({ 
        LayoutDashboard, Users, Calendar, CreditCard, UserCircle, LogOut, 
        Menu, Bell, User, Search, UserPlus, Edit, Trash2, Activity, DollarSign,
        XCircle
      })
    )
  ]
};
