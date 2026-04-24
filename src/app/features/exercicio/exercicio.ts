import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../domain/question/services/question.service';
import { Question } from '../../domain/question/models/question.interface';
import { PainelInstrucao } from './components/painel-instrucao/painel-instrucao';
import { PainelEditor } from './components/painel-editor/painel-editor';
import { SubmissionService } from '../../domain/submission/services/submission.service';
import { Submission } from '../../domain/submission/models/submission.interface';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-exercicio',
  imports: [PainelInstrucao, PainelEditor],
  templateUrl: './exercicio.html',
  styleUrl: './exercicio.css',
})
export class Exercicio implements OnInit {
  private route = inject(ActivatedRoute);
  private questionService = inject(QuestionService);
  private submissionService = inject(SubmissionService);
  private toastService = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  question = signal<Question | null>(null);
  avaliando = signal(false);
  feedback = signal<Submission | null>(null);
  
  codigoSelecionado = '# Escreva sua solução aqui em Python\n\ndef solution():\n    pass';

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      console.log('[Exercicio] Carregando ID:', id);
      
      if (id) {
        this.questionService.getById(id).subscribe({
          next: (q) => {
            console.log('[Exercicio] Questão carregada:', q.title);
            this.question.set(q);
          },
          error: (err) => {
            console.error('[Exercicio] Erro ao carregar questão:', err);
            this.toastService.showError('Erro', 'Não foi possível carregar os detalhes do exercício.');
          }
        });
      } else {
        console.warn('[Exercicio] ID inválido na rota:', params.get('id'));
      }
    });
  }

  submitCodigo(): void {
    const questionVal = this.question();
    if (!questionVal) return;

    this.avaliando.set(true);
    this.feedback.set(null); // Limpa o feedback anterior

    const req = {
      question_id: questionVal.id,
      code: this.codigoSelecionado
    };

    this.submissionService.submit(req).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (sub) => {
        // Agora inicia o polling com o ID retornado
        this.pollSubmission(sub.id);
      },
      error: (err) => {
        this.avaliando.set(false);
        this.toastService.showError('Erro ao enviar solução', 'Ocorreu um erro de rede. Tente novamente.');
        console.error('Erro no envio da submissão:', err);
      }
    });
  }

  private pollSubmission(id: number): void {
    this.submissionService.pollResult(id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (finalSubmission) => {
        this.avaliando.set(false);
        this.feedback.set(finalSubmission);
        
        if (finalSubmission.status === 'completed') {
          if (finalSubmission.is_correct) {
            this.toastService.showSuccess('Parabéns!', 'Sua solução está correta!');
          } else {
            this.toastService.showWarn('Ajustes necessários', 'Sua solução precisa ser revista, veja as orientações.');
          }
        } else if (finalSubmission.status === 'error') {
          this.toastService.showError('Erro na avaliação', 'Houve um problema ao processar seu código.');
        }
      },
      error: (err) => {
        this.avaliando.set(false);
        this.toastService.showError('Erro ao avaliar', 'Ocorreu um erro no processamento da AI.');
        console.error('Erro no polling:', err);
      }
    });
  }
}
