import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastService } from '../../../shared/services/toast.service';
import { AdminService } from '../../../domain/admin/services/admin.service';
import { AdminUser } from '../../../domain/admin/models/admin-user.interface';
import { FormError } from '../../../shared/components/form-error/form-error';

@Component({
  selector: 'app-professores-admin',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    FloatLabelModule,
    InputTextModule,
    TableModule,
    DialogModule,
    TagModule,
    TooltipModule,
    SkeletonModule,
    FormError
  ],
  templateUrl: './professores-admin.html',
  styleUrl: './professores-admin.css',
})
export class ProfessoresAdmin implements OnInit {
  teachers = signal<AdminUser[]>([]);
  loading = signal(false);
  
  // Dialogs
  showCreateDialog = signal(false);
  showEditDialog = signal(false);
  submitLoading = signal(false);
  resendLoading = signal<number | null>(null);

  inviteForm!: FormGroup;
  editForm!: FormGroup;

  private formBuilder = inject(FormBuilder);
  private toastService = inject(ToastService);
  private adminService = inject(AdminService);

  ngOnInit() {
    this.criarForms();
    this.carregarProfessores();
  }

  private criarForms() {
    this.inviteForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.editForm = this.formBuilder.group({
      id: [null, Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['']
    });
  }

  carregarProfessores() {
    this.loading.set(true);
    this.adminService.listTeachers().subscribe({
      next: (data) => {
        this.teachers.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Falha ao carregar professores:', err);
        this.toastService.showError('Não foi possível carregar a lista de professores.');
        this.loading.set(false);
      }
    });
  }

  abrirModalNovo() {
    this.inviteForm.reset();
    this.showCreateDialog.set(true);
  }

  enviarConvite() {
    if (this.inviteForm.invalid) {
      this.inviteForm.markAllAsTouched();
      return;
    }

    this.submitLoading.set(true);
    const { name, email } = this.inviteForm.value;

    this.adminService.createTeacher(name, email).subscribe({
      next: (response) => {
        this.toastService.showSuccess(response.message || 'Professor criado e convite enviado!');
        this.showCreateDialog.set(false);
        this.inviteForm.reset();
        this.submitLoading.set(false);
        this.carregarProfessores();
      },
      error: (err) => {
        console.error('Falha ao criar professor:', err);
        let errMsg = err.error?.message || err.error?.errors?.[0] || 'Ocorreu um erro ao enviar o convite.';
        if (errMsg === 'Email has already been taken' || errMsg.includes('already been taken')) {
          errMsg = 'Este e-mail já está cadastrado no sistema.';
        }
        this.toastService.showError(errMsg);
        this.submitLoading.set(false);
      }
    });
  }

  abrirModalEdicao(teacher: AdminUser) {
    this.editForm.reset();
    this.editForm.patchValue({
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      password: ''
    });
    this.showEditDialog.set(true);
  }

  salvarEdicao() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.submitLoading.set(true);
    const { id, name, email, password } = this.editForm.value;

    const payload: any = { user: { name, email } };
    if (password && password.trim() !== '') {
      payload.user.password = password;
    }

    this.adminService.updateTeacher(id, payload).subscribe({
      next: (response) => {
        this.toastService.showSuccess(response.message || 'Professor atualizado com sucesso!');
        this.showEditDialog.set(false);
        this.submitLoading.set(false);
        this.carregarProfessores();
      },
      error: (err) => {
        console.error('Falha ao editar professor:', err);
        let errMsg = err.error?.message || err.error?.errors?.[0] || 'Ocorreu um erro ao salvar as alterações.';
        if (errMsg === 'Email has already been taken' || errMsg.includes('already been taken')) {
          errMsg = 'Este e-mail já está em uso por outro usuário.';
        }
        this.toastService.showError(errMsg);
        this.submitLoading.set(false);
      }
    });
  }

  reenviarConvite(teacher: AdminUser) {
    this.resendLoading.set(teacher.id);
    this.adminService.resendInvitation(teacher.id).subscribe({
      next: (response) => {
        this.toastService.showSuccess(response.message || 'Convite reenviado com sucesso.');
        this.resendLoading.set(null);
        this.carregarProfessores();
      },
      error: (err) => {
        console.error('Falha ao reenviar convite:', err);
        const errMsg = err.error?.message || err.error?.error || 'Não foi possível reenviar o convite.';
        this.toastService.showError(errMsg);
        this.resendLoading.set(null);
      }
    });
  }
}
