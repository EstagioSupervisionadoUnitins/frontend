import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../domain/auth/service/auth.service';

export const roleRedirectGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.hasRole('teacher')) {
    router.navigate(['/professor/dashboard']);
    return false;
  }

  router.navigate(['/aluno/dashboard']);
  return false;
};
