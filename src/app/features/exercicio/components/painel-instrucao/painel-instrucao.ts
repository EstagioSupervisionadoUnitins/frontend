import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackIA } from '../../../../domain/aluno/models/exercicio.model';
import { Question } from '../../../../domain/question/models/question.interface';

@Component({
  selector: 'app-painel-instrucao',
  imports: [CommonModule],
  templateUrl: './painel-instrucao.html',
  styleUrl: './painel-instrucao.css',
})
export class PainelInstrucao {
  question = input.required<Question>();
  feedback = input<FeedbackIA | null>(null);
  avaliando = input<boolean>(false);
}
