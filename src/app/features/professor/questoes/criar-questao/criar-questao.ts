import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { QuestionService } from '../../../../domain/question/services/question.service';

@Component({
  selector: 'app-criar-questao',
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
  templateUrl: './criar-questao.html',
  styleUrl: './criar-questao.css'
})
export class CriarQuestao {
  private fb = inject(FormBuilder);
  private questionService = inject(QuestionService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  loading = signal(false);
  
  difficultyOptions = [
    { label: 'Fácil', value: 'easy' },
    { label: 'Médio', value: 'medium' },
    { label: 'Difícil', value: 'hard' }
  ];

  recipeForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    statement: ['', [Validators.required, Validators.minLength(20)]],
    difficulty: ['easy', Validators.required],
    constraints: ['']
  });

  onSubmit(): void {
    if (this.recipeForm.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Por favor, preencha todos os campos obrigatórios corretamente.' });
      return;
    }

    this.loading.set(true);
    const questionRequest = {
      question: this.recipeForm.value
    };

    this.questionService.create(questionRequest).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Questão criada com sucesso!' });
        setTimeout(() => this.router.navigate(['/professor/questoes']), 1500);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao salvar a questão.' });
        this.loading.set(false);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/professor/questoes']);
  }
}
