import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExercicioDetalhe, FeedbackIA } from '../../../../domain/aluno/models/exercicio.model';

@Component({
  selector: 'app-painel-instrucao',
  imports: [CommonModule],
  templateUrl: './painel-instrucao.html',
  styleUrl: './painel-instrucao.css',
})
export class PainelInstrucao {
  exercicio = input.required<ExercicioDetalhe>();
  feedback = input<FeedbackIA | null>(null);
  avaliando = input<boolean>(false);
}
