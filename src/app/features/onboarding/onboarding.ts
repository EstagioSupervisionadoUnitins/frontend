import { Component, inject, signal } from '@angular/core';
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
export class Onboarding {
  private classroomService = inject(ClassroomService);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);
  private router = inject(Router);

  code = signal('');
  loading = signal(false);

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
        this.loading.set(false);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Erro', 
          detail: 'Código inválido ou erro ao entrar na turma.' 
        });
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
