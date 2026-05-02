import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../shared/services/toast.service';
import { AuthService } from '../../domain/auth/service/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [IconFieldModule, InputIconModule, ReactiveFormsModule, ButtonModule, FloatLabelModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  forgotPasswordForm!: FormGroup;
  private formBuilder = inject(FormBuilder);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  private router = inject(Router);
  
  loading = signal(false);
  enviado = signal(false);

  constructor() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  public enviarLink() {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }
    
    this.loading.set(true);
    
    const email = this.forgotPasswordForm.value.email;

    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.toastService.showSuccess('Solicitação enviada!');
        this.enviado.set(true);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Falha ao enviar e-mail:', error);
        this.toastService.showError('Não foi possível processar sua solicitação no momento.');
        this.loading.set(false);
      }
    });
  }
}
