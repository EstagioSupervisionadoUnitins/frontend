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
import { AlunoService } from '../../domain/aluno/services/aluno.service';
import { Classroom } from '../../domain/classroom/models/classroom.interface';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    ToastModule,
    FloatLabelModule
  ],
  providers: [MessageService],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.css'
})
export class Onboarding implements OnInit {
  private classroomService = inject(ClassroomService);
  private alunoService = inject(AlunoService);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);
  private router = inject(Router);

  code = signal('');
  loading = signal(false);
  checkingStatus = signal(false);
  pendingClassroom = signal<Classroom | null>(null);

  ngOnInit(): void {
    this.checkInitialState();
  }

  checkInitialState(): void {
    // 1. Tenta carregar a turma ativa (matrículas aprovadas)
    this.classroomService.loadActiveClassroom().subscribe(classroom => {
      if (classroom) {
        this.router.navigate(['/aluno/dashboard']);
      } else {
        // 2. Se não houver ativa, busca as estatísticas para ver se há solicitação pendente
        this.alunoService.getStats().subscribe({
          next: (stats) => {
            if (stats && stats.classroom) {
              this.pendingClassroom.set(stats.classroom);
            }
          }
        });
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
        // Como o join no backend agora retorna apenas a mensagem de pendência,
        // vamos carregar os stats para atualizar a tela para o estado de "Aguardando aprovação"
        this.alunoService.getStats().subscribe({
          next: (stats) => {
            this.loading.set(false);
            if (stats && stats.classroom) {
              this.pendingClassroom.set(stats.classroom);
              this.messageService.add({ 
                severity: 'info', 
                summary: 'Solicitação Enviada', 
                detail: 'Aguarde a aprovação do professor.' 
              });
            } else {
              this.messageService.add({ 
                severity: 'success', 
                summary: 'Sucesso', 
                detail: res.message || 'Solicitação enviada!' 
              });
            }
          },
          error: () => {
            this.loading.set(false);
            this.messageService.add({ 
              severity: 'success', 
              summary: 'Sucesso', 
              detail: res.message || 'Solicitação enviada!' 
            });
          }
        });
      },
      error: (err) => {
        this.loading.set(false);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Erro', 
          detail: err.error?.error || err.error?.message || 'Código inválido ou erro ao entrar na turma.' 
        });
      }
    });
  }

  checkStatus() {
    this.checkingStatus.set(true);
    // Limpa o estado carregado da turma ativa no service para forçar nova requisição
    this.classroomService.clearActiveClassroom();
    
    // Tenta carregar novamente para ver se foi aprovado
    this.classroomService.loadActiveClassroom().subscribe({
      next: (classroom) => {
        if (classroom) {
          this.checkingStatus.set(false);
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Aprovado!', 
            detail: `Sua entrada na turma ${classroom.name} foi aprovada!` 
          });
          setTimeout(() => this.router.navigate(['/aluno/dashboard']), 1500);
        } else {
          // Se ainda não tem turma ativa, busca stats para verificar se foi rejeitado (matrícula excluída)
          this.alunoService.getStats().subscribe({
            next: (stats) => {
              this.checkingStatus.set(false);
              if (!stats || !stats.classroom) {
                // Foi rejeitado!
                this.pendingClassroom.set(null);
                this.messageService.add({ 
                  severity: 'warn', 
                  summary: 'Solicitação Recusada', 
                  detail: 'Sua solicitação de entrada foi recusada pelo professor. Você pode tentar outro código.' 
                });
              } else {
                // Continua pendente
                this.messageService.add({ 
                  severity: 'info', 
                  summary: 'Pendente', 
                  detail: 'Sua solicitação continua aguardando aprovação.' 
                });
              }
            },
            error: () => {
              this.checkingStatus.set(false);
            }
          });
        }
      },
      error: () => {
        this.checkingStatus.set(false);
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}

