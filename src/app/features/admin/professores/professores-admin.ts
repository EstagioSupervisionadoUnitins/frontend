import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ToastService } from '../../../shared/services/toast.service';
import { AuthService } from '../../../domain/auth/service/auth.service';
import { FormError } from '../../../shared/components/form-error/form-error';

@Component({
  selector: 'app-professores-admin',
  imports: [ReactiveFormsModule, ButtonModule, FloatLabelModule, InputTextModule, FormError],
  templateUrl: './professores-admin.html',
  styleUrl: './professores-admin.css',
})
export class ProfessoresAdmin implements OnInit {
  inviteForm!: FormGroup;
  loading = signal(false);

  private formBuilder = inject(FormBuilder);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);

  ngOnInit() {
    this.criarForm();
  }

  private criarForm() {
    this.inviteForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  enviarConvite() {
    if (this.inviteForm.invalid) {
      this.inviteForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const { name, email } = this.inviteForm.value;

    this.authService.createTeacher(name, email).subscribe({
      next: (response) => {
        this.toastService.showSuccess(response.message || 'Professor criado e convite enviado!');
        this.inviteForm.reset();
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Falha ao criar professor:', err);
        let errMsg = err.error?.message || err.error?.errors?.[0] || 'Ocorreu um erro ao enviar o convite.';
        
        // Traduzindo a mensagem do Rails para português de forma elegante
        if (errMsg === 'Email has already been taken' || errMsg.includes('already been taken')) {
          errMsg = 'Este e-mail já está cadastrado no sistema.';
        }
        
        this.toastService.showError(errMsg);
        this.loading.set(false);
      }
    });
  }
}
