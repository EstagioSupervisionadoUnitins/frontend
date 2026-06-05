import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';

import { ClassroomService } from '../../../domain/classroom/services/classroom.service';
import { Classroom } from '../../../domain/classroom/models/classroom.interface';
import { ClassroomRequestUser } from '../../../domain/classroom/models/classroom-request-user.interface';

@Component({
  selector: 'app-solicitacoes-professor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    SelectModule,
    ButtonModule,
    CardModule,
    ToastModule,
    TableModule
  ],
  providers: [MessageService],
  templateUrl: './solicitacoes.html',
  styleUrl: './solicitacoes.css'
})
export class SolicitacoesProfessor implements OnInit {
  private classroomService = inject(ClassroomService);
  private messageService = inject(MessageService);

  classrooms = signal<Classroom[]>([]);
  selectedClassroom = signal<Classroom | null>(null);
  requests = signal<ClassroomRequestUser[]>([]);
  
  loadingClassrooms = signal(true);
  loadingRequests = signal(false);
  processingId = signal<number | null>(null);

  ngOnInit(): void {
    this.loadClassrooms();
  }

  loadClassrooms(): void {
    this.loadingClassrooms.set(true);
    this.classroomService.list().subscribe({
      next: (data) => {
        this.classrooms.set(data);
        this.loadingClassrooms.set(false);
        if (data.length > 0) {
          this.selectedClassroom.set(data[0]);
          this.loadRequests();
        }
      },
      error: () => {
        this.loadingClassrooms.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar suas turmas.'
        });
      }
    });
  }

  onClassroomChange(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    const classroom = this.selectedClassroom();
    if (!classroom) return;

    this.loadingRequests.set(true);
    this.classroomService.getJoinRequests(classroom.id).subscribe({
      next: (data) => {
        this.requests.set(data);
        this.loadingRequests.set(false);
      },
      error: () => {
        this.loadingRequests.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar as solicitações da turma.'
        });
      }
    });
  }

  approve(user: ClassroomRequestUser): void {
    const classroom = this.selectedClassroom();
    if (!classroom) return;

    this.processingId.set(user.id);
    this.classroomService.approveJoinRequest(classroom.id, user.id).subscribe({
      next: (res) => {
        this.processingId.set(null);
        this.messageService.add({
          severity: 'success',
          summary: 'Aprovado',
          detail: `O aluno ${user.name} foi aprovado na turma!`
        });
        // Atualiza a lista local removendo o aprovado
        this.requests.update((list) => list.filter((r) => r.id !== user.id));
      },
      error: (err) => {
        this.processingId.set(null);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.error || 'Erro ao aprovar o aluno.'
        });
      }
    });
  }

  reject(user: ClassroomRequestUser): void {
    const classroom = this.selectedClassroom();
    if (!classroom) return;

    this.processingId.set(user.id);
    this.classroomService.rejectJoinRequest(classroom.id, user.id).subscribe({
      next: (res) => {
        this.processingId.set(null);
        this.messageService.add({
          severity: 'info',
          summary: 'Recusado',
          detail: `A solicitação de ${user.name} foi recusada.`
        });
        // Atualiza a lista local removendo o recusado
        this.requests.update((list) => list.filter((r) => r.id !== user.id));
      },
      error: (err) => {
        this.processingId.set(null);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.error || 'Erro ao recusar o aluno.'
        });
      }
    });
  }
}
