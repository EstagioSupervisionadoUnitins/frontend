import { Component, input, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Submission } from '../../../../domain/submission/models/submission.interface';
import { Question } from '../../../../domain/question/models/question.interface';

@Component({
  selector: 'app-painel-instrucao',
  imports: [CommonModule],
  templateUrl: './painel-instrucao.html',
  styleUrl: './painel-instrucao.css',
})
export class PainelInstrucao {
  question = input.required<Question>();
  feedback = input<Submission | null>(null);
  avaliando = input<boolean>(false);
  
  private location = inject(Location);

  voltar(): void {
    this.location.back();
  }
}
