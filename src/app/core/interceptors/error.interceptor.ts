import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../domain/auth/service/auth.service';
import { ToastService } from '../../shared/services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.warn('[ErrorInterceptor] 401 Unauthorized detected. Logging out...');
        toastService.showError('Sessão Expirada', 'Sua sessão expirou. Por favor, faça login novamente.');
        authService.logout();
      } else {
        toastService.showApiError(error);
      }
      return throwError(() => error);
    })
  );
};
