import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { TrilhaService } from '../../../../domain/trilha/services/trilha.service';
import { ClassroomService } from '../../../../domain/classroom/services/classroom.service';
import { QuestionService } from '../../../../domain/question/services/question.service';
import { Classroom } from '../../../../domain/classroom/models/classroom.interface';
import { Question } from '../../../../domain/question/models/question.interface';
import { DifficultyPipe } from '../../../../shared/pipes/difficulty.pipe';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-editar-trilha',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    InputTextModule, 
    TextareaModule, 
    SelectModule, 
    ButtonModule, 
    ToastModule,
    TableModule,
    TagModule,
    DifficultyPipe
  ],
  providers: [MessageService],
  templateUrl: './editar-trilha.html',
  styleUrl: './editar-trilha.css'
})
export class EditarTrilha implements OnInit {
  private fb = inject(FormBuilder);
  private trilhaService = inject(TrilhaService);
  private questionService = inject(QuestionService);
  private classroomService = inject(ClassroomService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);

  trilhaId: number | null = null;
  classrooms = signal<Classroom[]>([]);
  questions = signal<Question[]>([]);
  selectedQuestions = signal<Question[]>([]);
  loading = signal(false);
  loadingData = signal(false);
  loadingQuestions = signal(false);

  trilhaForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    classroom_id: [{ value: null, disabled: true }, Validators.required]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.trilhaId = Number(id);
      this.loadInitialData();
    }
  }

  loadInitialData(): void {
    this.loadingData.set(true);
    if (!this.trilhaId) return;

    forkJoin({
      classrooms: this.classroomService.list(),
      playlist: this.trilhaService.getById(this.trilhaId)
    }).subscribe({
      next: (data) => {
        this.classrooms.set(data.classrooms);
        this.trilhaForm.patchValue({
          title: data.playlist.title,
          description: data.playlist.description,
          classroom_id: data.playlist.classroom_id
        });
        
        // Carrega questões da turma da playlist
        this.loadQuestions(data.playlist.classroom_id, data.playlist.questions);
        this.loadingData.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar dados da trilha.' });
        this.loadingData.set(false);
      }
    });
  }

  loadQuestions(classroomId: number, currentQuestions: Question[] = []): void {
    this.loadingQuestions.set(true);
    this.questionService.list(classroomId).subscribe({
      next: (data) => {
        this.questions.set(data);
        
        // Mapeia as questões atuais para a seleção (usando ID para garantir match)
        const currentIds = currentQuestions.map(q => q.id);
        const selected = data.filter(q => currentIds.includes(q.id));
        this.selectedQuestions.set(selected);
        
        this.loadingQuestions.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar questões da turma.' });
        this.loadingQuestions.set(false);
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

  onSubmit(): void {
    if (this.trilhaForm.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha os campos obrigatórios.' });
      return;
    }

    if (this.selectedQuestions().length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Selecione pelo menos uma questão.' });
      return;
    }

    if (!this.trilhaId) return;

    this.loading.set(true);
    const request = {
      title: this.trilhaForm.get('title')?.value,
      description: this.trilhaForm.get('description')?.value,
      question_ids: this.selectedQuestions().map(q => q.id)
    };

    this.trilhaService.update(this.trilhaId, request).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Trilha atualizada com sucesso!' });
        setTimeout(() => this.router.navigate(['/professor/trilhas']), 1500);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar a trilha.' });
        this.loading.set(false);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/professor/trilhas']);
  }
}
