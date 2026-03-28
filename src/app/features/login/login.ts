import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PasswordModule } from 'primeng/password';
import { Router } from '@angular/router';
import { ToastService } from '../../shared/services/toast.service';
import { AuthService } from '../../domain/auth/service/auth.service';

@Component({
  selector: 'app-login',
  imports: [IconFieldModule, InputIconModule, PasswordModule, ReactiveFormsModule, ButtonModule, FloatLabelModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  loginForm!: FormGroup;
  private formBuilder = inject(FormBuilder);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private authService = inject(AuthService);
  loading = signal(false);

  constructor() {
    this.criarLoginForm();
  }


  private criarLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: [''],
      senha: ['']
    });
  }

  public login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.authService.login(this.loginForm.value.email, this.loginForm.value.senha).subscribe({
      next: (response) => {
        console.log('Login realizado com sucesso:', response);

        this.toastService.showSuccess('Login realizado com sucesso!');
        if (response.perfil.id === 1) {
          this.router.navigate(['/teste']);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Login falhou:', error);
        this.loading.set(false);
      }
    });
  }

}
