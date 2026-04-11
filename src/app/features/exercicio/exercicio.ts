import { Component, inject, OnInit } from '@angular/core';
import { ExercicioMockService } from '../../domain/aluno/services/exercicio-mock.service';
import { PainelInstrucao } from './components/painel-instrucao/painel-instrucao';
import { PainelEditor } from './components/painel-editor/painel-editor';

@Component({
  selector: 'app-exercicio',
  imports: [PainelInstrucao, PainelEditor],
  templateUrl: './exercicio.html',
  styleUrl: './exercicio.css',
})
export class Exercicio implements OnInit {
  private exercicioService = inject(ExercicioMockService);

  exercicio = this.exercicioService.exercicioDetalhe;
  avaliando = this.exercicioService.avaliando;
  feedback = this.exercicioService.feedback;
  
  codigoSelecionado = '';

  ngOnInit(): void {
    // Inicializa o código do editor com o código base do exercício
    this.codigoSelecionado = this.exercicio().codigoBase;
  }

  submitCodigo(): void {
    this.exercicioService.avaliarCodigo(this.codigoSelecionado);
  }
}
