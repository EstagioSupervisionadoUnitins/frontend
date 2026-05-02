import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ClassroomService } from '../../domain/classroom/services/classroom.service';
import { AuthService } from '../../domain/auth/service/auth.service';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.css'
})
export class Onboarding implements OnInit {
  private classroomService = inject(ClassroomService);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);
  private router = inject(Router);

  code = signal('');
  loading = signal(false);

  ngOnInit(): void {
    // Se o aluno já possui uma turma (ex: acessando de outro navegador), redireciona direto
    this.classroomService.loadActiveClassroom().subscribe(classroom => {
      if (classroom) {
        this.router.navigate(['/aluno/dashboard']);
      }
    });
  }

  joinClassroom() {
    if (!this.code()) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Atenção', 
        detail: 'Por favor, insira o código da turma.' 
      });
      return;
    }

    this.loading.set(true);
    this.classroomService.join({ code: this.code() }).subscribe({
      next: (res: any) => {
        const classroom = res.classroom || res;
        this.classroomService.setActiveClassroom(classroom);
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Sucesso', 
          detail: `Você entrou na turma ${classroom.name}!` 
        });
        setTimeout(() => this.router.navigate(['/aluno/dashboard']), 1500);
      },
      error: (err) => {
        // Se o erro for que o aluno já está em uma turma (unique constraint ou regra de negócio)
        if (err.status === 422) {
          this.classroomService.loadActiveClassroom().subscribe(classroom => {
            if (classroom) {
              this.messageService.add({ 
                severity: 'info', 
                summary: 'Turma Detectada', 
                detail: 'Você já está vinculado a uma turma. Redirecionando...' 
              });
              setTimeout(() => this.router.navigate(['/aluno/dashboard']), 1500);
            } else {
              this.loading.set(false);
              this.messageService.add({ 
                severity: 'error', 
                summary: 'Erro', 
                detail: err.error?.error || 'Erro ao entrar na turma.' 
              });
            }
          });
        } else {
          this.loading.set(false);
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Erro', 
            detail: 'Código inválido ou erro ao entrar na turma.' 
          });
        }
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
