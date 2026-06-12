import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthService } from './services/auth.service';
import { firstValueFrom } from 'rxjs';
import { authInterceptor } from './auth.interceptor';
import { 
  LucideAngularModule,
  LayoutDashboard, Users, Calendar, CreditCard, UserCircle, LogOut, 
  Menu, Bell, User, Search, UserPlus, Edit, Trash2, Activity, DollarSign,
  XCircle, ArrowRight, Star, Quote, Phone, Mail, MapPin, Facebook, 
  Instagram, Linkedin, Twitter, Camera, Wind, Award, CheckCircle,
  AlignCenter, Anchor, Sparkles, Baby, ShieldCheck, Scissors, Layers,
  Lock, Eye, EyeOff, Plus, CalendarX, SearchX, PlusCircle, MoreVertical, FileText, Info
} from 'lucide-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])), 
    provideAnimationsAsync(),
    {
      provide: APP_INITIALIZER,
      useFactory: (authService: AuthService) => {
        return () => firstValueFrom(authService.verificarSesion());
      },
      deps: [AuthService],
      multi: true
    },
    importProvidersFrom(
      LucideAngularModule.pick({ 
        LayoutDashboard, Users, Calendar, CreditCard, UserCircle, LogOut, 
        Menu, Bell, User, Search, UserPlus, Edit, Trash2, Activity, DollarSign,
        XCircle, ArrowRight, Star, Quote, Phone, Mail, MapPin, Facebook, 
        Instagram, Linkedin, Twitter, Camera, Wind, Award, CheckCircle,
        AlignCenter, Anchor, Sparkles, Baby, ShieldCheck, Scissors, Layers,
        Lock, Eye, EyeOff, Plus, CalendarX, SearchX, PlusCircle, MoreVertical, FileText, Info
      })
    )
  ]
};
