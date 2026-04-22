import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { QuestionService } from '../../../domain/question/services/question.service';
import { Question } from '../../../domain/question/models/question.interface';

@Component({
  selector: 'app-questoes-professor',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TagModule, ToastModule],
  providers: [MessageService],
  templateUrl: './questoes-professor.html',
  styleUrl: './questoes-professor.css'
})
export class QuestoesProfessor implements OnInit {
  private questionService = inject(QuestionService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  questions = signal<Question[]>([]);
  loading = signal(false);

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.loading.set(true);
    this.questionService.list().subscribe({
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
}
