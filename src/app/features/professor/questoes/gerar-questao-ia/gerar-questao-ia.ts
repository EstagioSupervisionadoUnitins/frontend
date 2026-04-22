import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { QuestionService } from '../../../../domain/question/services/question.service';
import { Question } from '../../../../domain/question/models/question.interface';

@Component({
  selector: 'app-gerar-questao-ia',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    TextareaModule, 
    ButtonModule, 
    ToastModule, 
    CardModule,
    TagModule
  ],
  providers: [MessageService],
  templateUrl: './gerar-questao-ia.html',
  styleUrl: './gerar-questao-ia.css'
})
export class GerarQuestaoIA {
  private questionService = inject(QuestionService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  context = signal('');
  loading = signal(false);
  generatedQuestions = signal<Question[]>([]);

  onGenerate(): void {
    if (!this.context().trim()) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Por favor, informe um contexto para a geração.' });
      return;
    }

    this.loading.set(true);
    this.generatedQuestions.set([]);

    this.questionService.generate({ context: this.context() }).subscribe({
      next: (questions) => {
        this.generatedQuestions.set(questions);
        this.loading.set(false);
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'IA gerou 3 novas questões!' });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao gerar questões via IA.' });
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

  onBack(): void {
    this.router.navigate(['/professor/questoes']);
  }
}
