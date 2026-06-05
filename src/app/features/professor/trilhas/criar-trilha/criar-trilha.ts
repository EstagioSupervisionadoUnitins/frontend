import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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

import { FormError } from '../../../../shared/components/form-error/form-error';

@Component({
  selector: 'app-criar-trilha',
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
    DifficultyPipe,
    FormError
  ],
  providers: [MessageService],
  templateUrl: './criar-trilha.html',
  styleUrl: './criar-trilha.css'
})
export class CriarTrilha implements OnInit {
  private fb = inject(FormBuilder);
  private trilhaService = inject(TrilhaService);
  private questionService = inject(QuestionService);
  private classroomService = inject(ClassroomService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  classrooms = signal<Classroom[]>([]);
  questions = signal<Question[]>([]);
  selectedQuestions = signal<Question[]>([]);
  loading = signal(false);
  loadingQuestions = signal(false);

  trilhaForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    classroom_id: [null, Validators.required]
  });

  ngOnInit(): void {
    this.loadClassrooms();
    
    // Escuta mudanças na turma para carregar as questões correspondentes
    this.trilhaForm.get('classroom_id')?.valueChanges.subscribe(id => {
      if (id) this.loadQuestions(id);
    });
  }

  loadClassrooms(): void {
    this.classroomService.list().subscribe({
      next: (data) => {
        this.classrooms.set(data);
        if (data.length === 1) {
          this.trilhaForm.patchValue({ classroom_id: data[0].id });
        }
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar turmas.' });
      }
    });
  }

  loadQuestions(classroomId: number): void {
    this.loadingQuestions.set(true);
    this.questionService.list(classroomId).subscribe({
      next: (data) => {
        this.questions.set(data);
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
      this.trilhaForm.markAllAsTouched();
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha os campos obrigatórios.' });
      return;
    }

    if (this.selectedQuestions().length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Selecione pelo menos uma questão para a trilha.' });
      return;
    }

    this.loading.set(true);
    const request = {
      ...this.trilhaForm.value,
      question_ids: this.selectedQuestions().map(q => q.id)
    };

    this.trilhaService.create(request).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Trilha criada com sucesso!' });
        setTimeout(() => this.router.navigate(['/professor/trilhas']), 1500);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao salvar a trilha.' });
        this.loading.set(false);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/professor/trilhas']);
  }
}
