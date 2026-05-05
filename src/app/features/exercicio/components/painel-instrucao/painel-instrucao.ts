import { Component, input, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { Submission } from '../../../../domain/submission/models/submission.interface';
import { Question } from '../../../../domain/question/models/question.interface';
import { DifficultyPipe } from '../../../../shared/pipes/difficulty.pipe';

@Component({
  selector: 'app-painel-instrucao',
  imports: [CommonModule, DifficultyPipe],
  templateUrl: './painel-instrucao.html',
  styleUrl: './painel-instrucao.css',
})
export class PainelInstrucao {
  question = input.required<Question>();
  feedback = input<Submission | null>(null);
  avaliando = input<boolean>(false);
  proximaQuestaoId = input<number | null>(null);
  
  private location = inject(Location);
  private router = inject(Router);

  voltar(): void {
    this.location.back();
  }

  irParaProxima(): void {
    const nextId = this.proximaQuestaoId();
    if (nextId) {
      this.router.navigate(['/aluno/exercicio', nextId]);
    }
  }
}
