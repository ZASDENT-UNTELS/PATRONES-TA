import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './services/auth.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si ya sabemos el estado (no es "verificando"), resolver inmediatamente
  if (authService.verificacionCompleta()) {
    return resolverAcceso(authService, route, router);
  }

  // Si aún está verificando, esperar a que termine
  return toObservable(authService.verificacionCompleta).pipe(
    filter(completa => completa === true),
    take(1),
    map(() => resolverAcceso(authService, route, router))
  );
};

function resolverAcceso(authService: AuthService, route: any, router: Router): boolean | import('@angular/router').UrlTree {
  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }
  const requiredRoles = route.data['roles'] as number[];
  if (requiredRoles && !authService.hasRole(requiredRoles)) {
    return router.createUrlTree(['/app/dashboard']);
  }
  return true;
}
