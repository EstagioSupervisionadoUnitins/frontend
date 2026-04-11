import { Injectable, signal } from '@angular/core';
import { Progresso } from '../models/progresso.model';

@Injectable({
  providedIn: 'root',
})
export class AlunoMockService {

  progresso = signal<Progresso>({
    percentual: 68,
    tituloModulo: 'Estruturas de Controle',
    descricaoModulo: 'Aprenda a dominar if/else, switch e operadores lógicos para controlar o fluxo do seu programa.',
  });

  insightIA = signal<string>(
    'Você tem se saído muito bem em laços de repetição! Percebi que operadores ternários ainda são um ponto a melhorar. Que tal praticar com exercícios focados nesse tema?'
  );
}
