import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';
import { QuestionService } from '../../../../domain/question/services/question.service';
import { Question } from '../../../../domain/question/models/question.interface';
import { ClassroomService } from '../../../../domain/classroom/services/classroom.service';
import { Classroom } from '../../../../domain/classroom/models/classroom.interface';
import { DifficultyPipe } from '../../../../shared/pipes/difficulty.pipe';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-gerar-questao-ia',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    TextareaModule, 
    SelectModule,
    ButtonModule, 
    ToastModule, 
    CardModule,
    TagModule,
    InputNumberModule,
    DifficultyPipe,
    MarkdownComponent
  ],
  providers: [MessageService],
  templateUrl: './gerar-questao-ia.html',
  styleUrl: './gerar-questao-ia.css'
})
export class GerarQuestaoIA {
  private questionService = inject(QuestionService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private classroomService = inject(ClassroomService);

  classrooms = signal<Classroom[]>([]);
  selectedClassroomId = signal<number | null>(null);
  context = signal('');
  quantity = signal<number>(3);
  loadingClassrooms = signal(false);
  loading = signal(false);
  generatedQuestions = signal<Question[]>([]);

  ngOnInit(): void {
    this.loadClassrooms();
  }

  loadClassrooms(): void {
    this.loadingClassrooms.set(true);
    this.classroomService.list().subscribe({
      next: (data) => {
        this.classrooms.set(data);
        if (data.length === 1) {
          this.selectedClassroomId.set(data[0].id);
        }
        this.loadingClassrooms.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar turmas.' });
        this.loadingClassrooms.set(false);
      }
    });
  }

  onGenerate(): void {
    if (!this.selectedClassroomId()) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Por favor, selecione uma turma.' });
      return;
    }

    if (!this.context().trim()) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Por favor, informe um contexto para a geração.' });
      return;
    }

    this.loading.set(true);
    this.generatedQuestions.set([]);

    const classroomId = this.selectedClassroomId();
    if (!classroomId) return; // double check for safety

    this.questionService.generate({ 
      context: this.context(), 
      classroom_id: classroomId,
      quantity: this.quantity() 
    }).subscribe({
      next: (res) => {
        this.generatedQuestions.set(res.questions);
        this.loading.set(false);
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Sucesso', 
          detail: `IA gerou ${res.questions.length} novas questões!` 
        });
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
