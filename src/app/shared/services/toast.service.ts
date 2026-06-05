import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';

export interface ApiErrorPayload {
  error?: string;
  message?: string;
  errors?: any;
}

export interface ToastOptions {
  severity: 'success' | 'info' | 'warn' | 'error';
  summary: string;
  detail?: string;
  life?: number;
  sticky?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private messageService = inject(MessageService);

  showToast(toast: ToastOptions): void {
    this.messageService.add({
      key: 'app',
      severity: toast.severity,
      summary: toast.summary,
      detail: toast.detail || '',
      life: toast.life || (toast.severity === 'error' ? 5000 : 3000),
      sticky: toast.sticky || false,
    });
  }

  showSuccess(summary: string, detail?: string): void {
    this.showToast({
      severity: 'success',
      summary,
      detail,
      life: 4000,
    });
  }

  showError(summary: string, detail?: string): void {
    this.showToast({
      severity: 'error',
      summary,
      detail,
      life: 6000,
    });
  }

  showInfo(summary: string, detail?: string): void {
    this.showToast({
      severity: 'info',
      summary,
      detail,
      life: 4000,
    });
  }

  showWarn(summary: string, detail?: string): void {
    this.showToast({
      severity: 'warn',
      summary,
      detail,
      life: 5000,
    });
  }

  clear(): void {
    this.messageService.clear('app');
  }

  showApiError(errorResponse: HttpErrorResponse): void {
    let apiMessage = 'Ocorreu um erro inesperado.';

    if (errorResponse.error && errorResponse.error.message) {
      apiMessage = errorResponse.error.message;
    } else if (errorResponse.message) {
      apiMessage = errorResponse.message;
    }

    if (errorResponse.status >= 500) {
      this.showError('Erro de Servidor', 'Ocorreu um erro interno no servidor.');
    } else {
      this.showError('Erro', apiMessage);
    }
  }
}
