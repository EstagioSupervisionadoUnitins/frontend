import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DifficultyPipe } from '../../../shared/pipes/difficulty.pipe';
import { QuestionService } from '../../../domain/question/services/question.service';
import { Question } from '../../../domain/question/models/question.interface';
import { ClassroomService } from '../../../domain/classroom/services/classroom.service';
import { Classroom } from '../../../domain/classroom/models/classroom.interface';

@Component({
  selector: 'app-questoes-professor',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TagModule, ToastModule, SelectModule, FormsModule, DifficultyPipe],
  providers: [MessageService],
  templateUrl: './questoes-professor.html',
  styleUrl: './questoes-professor.css'
})
export class QuestoesProfessor implements OnInit {
  private questionService = inject(QuestionService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private classroomService = inject(ClassroomService);
  
  questions = signal<Question[]>([]);
  classrooms = signal<Classroom[]>([]);
  selectedClassroomId = signal<number | null>(null);
  loading = signal(false);
  loadingClassrooms = signal(false);

  ngOnInit(): void {
    this.loadClassrooms();
  }

  loadClassrooms(): void {
    this.loadingClassrooms.set(true);
    this.classroomService.list().subscribe({
      next: (data) => {
        this.classrooms.set(data);
        if (data.length > 0) {
          this.selectedClassroomId.set(data[0].id);
          this.loadQuestions();
        }
        this.loadingClassrooms.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar turmas.' });
        this.loadingClassrooms.set(false);
      }
    });
  }

  loadQuestions(): void {
    const classroomId = this.selectedClassroomId();
    if (!classroomId) return;

    this.loading.set(true);
    this.questionService.list(classroomId).subscribe({
      next: (data) => {
        this.questions.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar questões.' });
        this.loading.set(false);
      }
    });
  }

  getSeverity(difficulty: string): "success" | "warn" | "danger" | "secondary" | "info" | undefined {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warn';
      case 'hard': return 'danger';
      default: return 'info';
    }
  }

  novaQuestaoManual(): void {
    this.router.navigate(['/professor/questoes/nova']);
  }

  gerarQuestaoIA(): void {
    this.router.navigate(['/professor/questoes/gerar']);
  }

  editarQuestao(id: number): void {
    this.router.navigate(['/professor/questoes', id, 'editar']);
  }

  onClassroomChange(): void {
    this.loadQuestions();
  }

  excluirQuestao(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta questão?')) {
      this.questionService.delete(id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Questão excluída com sucesso!' });
          this.loadQuestions();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir questão.' });
        }
      });
    }
  }
}
