import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { QuestionService } from '../../../../domain/question/services/question.service';
import { QuestionUpdate } from '../../../../domain/question/models/question-update.interface';
import { ClassroomService } from '../../../../domain/classroom/services/classroom.service';
import { Classroom } from '../../../../domain/classroom/models/classroom.interface';

@Component({
  selector: 'app-editar-questao',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    InputTextModule, 
    TextareaModule, 
    SelectModule, 
    ButtonModule, 
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './editar-questao.html',
  styleUrl: './editar-questao.css'
})
export class EditarQuestao implements OnInit {
  private fb = inject(FormBuilder);
  private questionService = inject(QuestionService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);
  private classroomService = inject(ClassroomService);

  classrooms = signal<Classroom[]>([]);

  questionId: number = 0;
  loading = signal(false);
  fetching = signal(true);
  
  difficultyOptions = [
    { label: 'Fácil', value: 'easy' },
    { label: 'Médio', value: 'medium' },
    { label: 'Difícil', value: 'hard' }
  ];

  recipeForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    statement: ['', [Validators.required, Validators.minLength(20)]],
    difficulty: ['easy', Validators.required],
    classroom_id: [null, Validators.required],
    constraints: ['']
  });

  ngOnInit(): void {
    this.loadClassrooms();
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.questionId = +idParam;
      this.loadQuestion();
    } else {
      this.router.navigate(['/professor/questoes']);
    }
  }

  loadClassrooms(): void {
    this.classroomService.list().subscribe({
      next: (data) => this.classrooms.set(data),
      error: () => this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar turmas.' })
    });
  }

  loadQuestion(): void {
    this.fetching.set(true);
    this.questionService.getById(this.questionId).subscribe({
      next: (question) => {
        this.recipeForm.patchValue({
          title: question.title,
          statement: question.statement,
          difficulty: question.difficulty,
          classroom_id: question.classroom_id,
          constraints: question.constraints
        });
        this.fetching.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar os dados da questão.' });
        this.fetching.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.recipeForm.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Por favor, preencha todos os campos obrigatórios corretamente.' });
      return;
    }

    this.loading.set(true);
    const updateRequest: QuestionUpdate = {
      question: this.recipeForm.value
    };

    this.questionService.update(this.questionId, updateRequest).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Questão atualizada com sucesso!' });
        setTimeout(() => this.router.navigate(['/professor/questoes']), 1500);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar a questão.' });
        this.loading.set(false);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/professor/questoes']);
  }
}
