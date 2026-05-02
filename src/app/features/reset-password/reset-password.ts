import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastService } from '../../shared/services/toast.service';
import { AuthService } from '../../domain/auth/service/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, ButtonModule, FloatLabelModule, PasswordModule, InputTextModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword implements OnInit {
  resetPasswordForm!: FormGroup;
  private formBuilder = inject(FormBuilder);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  loading = signal(false);
  resetSucesso = signal(false);

  constructor() {
    this.resetPasswordForm = this.formBuilder.group({
      token: ['', [Validators.required, Validators.minLength(4)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        this.resetPasswordForm.patchValue({
          token: params['token']
        });
      }
    });
  }

  public resetPassword() {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }
    
    this.loading.set(true);
    
    const token = this.resetPasswordForm.value.token;
    const newPassword = this.resetPasswordForm.value.newPassword;

    this.authService.resetPassword(token, newPassword).subscribe({
      next: () => {
        this.toastService.showSuccess('Senha redefinida com sucesso!');
        this.resetSucesso.set(true);
        this.loading.set(false);
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        console.error('Falha ao redefinir senha:', error);
        if (error.status === 400 || error.status === 401 || error.status === 404) {
          this.toastService.showError('Token inválido ou expirado. Solicite uma nova recuperação.');
        } else {
          this.toastService.showError('Ocorreu um erro. Tente novamente mais tarde.');
        }
        this.loading.set(false);
      }
    });
  }
}
