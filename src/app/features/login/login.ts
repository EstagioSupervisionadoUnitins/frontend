import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PasswordModule } from 'primeng/password';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../shared/services/toast.service';
import { AuthService } from '../../domain/auth/service/auth.service';

@Component({
  selector: 'app-login',
  imports: [IconFieldModule, InputIconModule, PasswordModule, ReactiveFormsModule, ButtonModule, FloatLabelModule, RouterLink],
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
    
    this.loading.set(true);
    
    const credenciais = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.senha
    };

    this.authService.login(credenciais).subscribe({
      next: (response) => {
        console.log('Login realizado com sucesso:', response);

        this.toastService.showSuccess('Login realizado com sucesso!');
        if (response.role === 'student') {
          this.router.navigate(['/aluno/dashboard']);
        } else {
          this.router.navigate(['/professor/questoes']);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Login falhou:', error);
        this.toastService.showError('Falha no login. Verifique suas credenciais.');
        this.loading.set(false);
      }
    });
  }

}
