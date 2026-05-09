import { HttpInterceptorFn, HttpErrorResponse, HttpContextToken } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../domain/auth/service/auth.service';
import { ToastService } from '../../shared/services/toast.service';

// Token para pular a exibição global de Toasts genéricos de erro
export const SKIP_GLOBAL_ERROR = new HttpContextToken<boolean>(() => false);

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Se a requisição solicitou explicitamente pular o tratamento global de erro
      if (req.context.get(SKIP_GLOBAL_ERROR)) {
        return throwError(() => error);
      }

      // Identifica se é uma requisição do fluxo de login ou cadastro
      const isAuthRequest = req.url.includes('/auth/login') || req.url.includes('/auth/signup') || req.url.includes('/auth/reset_password');

      if (error.status === 401) {
        // Se for erro de autenticação na própria tela de login/signup, deixa o componente tratar sozinho
        if (isAuthRequest) {
          return throwError(() => error);
        }

        console.warn('[ErrorInterceptor] 401 Unauthorized detected. Logging out...');
        toastService.showError('Sessão Expirada', 'Sua sessão expirou. Por favor, faça login novamente.');
        authService.logout();
      } else {
        // Se for requisições normais da aplicação, mostra o erro global genérico. Se for auth, o componente exibe a mensagem específica.
        if (!isAuthRequest) {
          toastService.showApiError(error);
        }
      }
      return throwError(() => error);
    })
  );
};

