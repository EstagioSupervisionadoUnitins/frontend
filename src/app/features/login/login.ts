import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PasswordModule } from 'primeng/password';
import { Router } from '@angular/router';
import { ToastService } from '../../shared/services/toast.service';

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


  constructor() {
    this.criarLoginForm();
  }


  private criarLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: [''],
      senha: ['']
    });
  }

  public login(){
    this.toastService.showSuccess('Login bem-sucedido', 'Bem-vindo de volta!');
      this.router.navigate(['/teste']);
  }

}
