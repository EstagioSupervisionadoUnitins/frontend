import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../domain/auth/service/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRoles = route.data?.['roles'] as string[];

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  if (!expectedRoles || expectedRoles.length === 0) {
    return true;
  }

  const hasPermission = expectedRoles.some(role => authService.hasRole(role));

  if (hasPermission) {
    return true;
  }

  // Se não tiver permissão, redireciona para o dashboard se for aluno, senão vai para login
  if (authService.hasRole('student')) {
    router.navigate(['/aluno/dashboard']);
  } else {
    router.navigate(['/login']);
  }
  return false;
};
