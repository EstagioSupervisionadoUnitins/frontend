import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { ClassroomService } from '../../domain/classroom/services/classroom.service';
import { AuthService } from '../../domain/auth/service/auth.service';
import { Classroom } from '../../domain/classroom/models/classroom.interface';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-turmas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    SkeletonModule,
    ToastModule,
    TooltipModule
  ],
  templateUrl: './turmas.html',
  styleUrl: './turmas.css',
})
export class Turmas implements OnInit {
  public classroomService = inject(ClassroomService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  classrooms = signal<Classroom[]>([]);
  loading = signal(false);

  // Professor Creation Modal
  displayCreateModal = signal(false);
  newClassName = signal('');
  newClassDescription = signal('');
  generatedCode = signal('');

  ngOnInit(): void {
    this.loadClassrooms();
  }

  loadClassrooms(): void {
    this.loading.set(true);
    this.classroomService.list().subscribe({
      next: (data) => {
        this.classrooms.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar as turmas.' });
        this.loading.set(false);
      }
    });
  }

  openCreateModal(): void {
    this.newClassName.set('');
    this.newClassDescription.set('');
    this.generatedCode.set(this.classroomService.generateCode());
    this.displayCreateModal.set(true);
  }

  createClassroom(): void {
    if (!this.newClassName()) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'O nome da turma é obrigatório.' });
      return;
    }

    this.classroomService.create({
      classroom: {
        name: this.newClassName(),
        code: this.generatedCode(),
        description: this.newClassDescription() || undefined
      }
    }).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Turma criada com sucesso!' });
        this.displayCreateModal.set(false);
        this.loadClassrooms();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao criar turma.' });
      }
    });
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.messageService.add({ severity: 'info', summary: 'Copiado', detail: 'Código copiado para a área de transferência.' });
    });
  }
}
