import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../shared/services/toast.service';
import { AuthService } from '../../domain/auth/service/auth.service';
import { SignupRequest } from '../../domain/auth/models/signup-request.interface';

import { FormError } from '../../shared/components/form-error/form-error';

@Component({
  selector: 'app-signup',
  imports: [IconFieldModule, InputIconModule, PasswordModule, ReactiveFormsModule, ButtonModule, FloatLabelModule, RouterLink, InputTextModule, FormError],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {

  signupForm!: FormGroup;
  private formBuilder = inject(FormBuilder);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private authService = inject(AuthService);
  loading = signal(false);

  constructor() {
    this.criarSignupForm();
  }

  private criarSignupForm() {
    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  public signup() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    const dados: SignupRequest = {
      name: this.signupForm.value.name,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password
    };

    this.authService.signup(dados).subscribe({
      next: () => {
        this.toastService.showSuccess('Conta criada com sucesso! Entrando...');
        
        // Auto-login
        this.authService.login({ email: dados.email, password: dados.password }).subscribe({
          next: (response) => {
            if (response.role === 'super_admin') {
              this.router.navigate(['/admin/professores']);
            } else if (response.role === 'teacher') {
              this.router.navigate(['/professor/dashboard']);
            } else {
              this.router.navigate(['/aluno/dashboard']);
            }
            this.loading.set(false);
          },
          error: () => {
            this.toastService.showWarn('Conta criada, mas houve um erro ao entrar. Por favor, faça login manualmente.');
            this.router.navigate(['/login']);
            this.loading.set(false);
          }
        });
      },
      error: (error) => {
        console.error('Signup falhou:', error);
        this.toastService.showError('Falha ao criar conta.');
        this.loading.set(false);
      }
    });
  }
}
