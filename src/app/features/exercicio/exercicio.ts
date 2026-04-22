import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../domain/question/services/question.service';
import { Question } from '../../domain/question/models/question.interface';
import { PainelInstrucao } from './components/painel-instrucao/painel-instrucao';
import { PainelEditor } from './components/painel-editor/painel-editor';

@Component({
  selector: 'app-exercicio',
  imports: [PainelInstrucao, PainelEditor],
  templateUrl: './exercicio.html',
  styleUrl: './exercicio.css',
})
export class Exercicio implements OnInit {
  private route = inject(ActivatedRoute);
  private questionService = inject(QuestionService);

  question = signal<Question | null>(null);
  avaliando = signal(false);
  feedback = signal(null); // TODO: Integrar com SubmissionService na Fase 3
  
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
          }
        });
      } else {
        console.warn('[Exercicio] ID inválido na rota:', params.get('id'));
      }
    });
  }

  submitCodigo(): void {
    console.log('Enviando código:', this.codigoSelecionado);
    // TODO: Implementar submissão na Fase 3
  }
}
