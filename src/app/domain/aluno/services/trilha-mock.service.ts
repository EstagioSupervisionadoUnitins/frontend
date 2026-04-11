import { Injectable, signal } from '@angular/core';
import { Modulo } from '../models/trilha.model';

@Injectable({
  providedIn: 'root',
})
export class TrilhaMockService {

  modulos = signal<Modulo[]>([
    {
      id: 1,
      titulo: 'Introdução e Variáveis',
      descricao: 'Conceitos básicos de algoritmos e como armazenar dados.',
      status: 'concluido',
      aulas: [
        { titulo: 'O que é Lógica?', tipo: 'video', concluida: true },
        { titulo: 'Tipos Primitivos', tipo: 'leitura', concluida: true },
        { titulo: 'Praticando Variáveis', tipo: 'exercicio', concluida: true },
      ]
    },
    {
      id: 2,
      titulo: 'Estruturas Condicionais',
      descricao: 'Tomada de decisão com If, Else e Switch Case.',
      status: 'em_andamento',
      aulas: [
        { titulo: 'Explorando o If', tipo: 'video', concluida: true },
        { titulo: 'Aninhamento de Condições', tipo: 'video', concluida: false },
        { titulo: 'Desafio do Triângulo', tipo: 'exercicio', concluida: false },
      ]
    },
    {
      id: 3,
      titulo: 'Estruturas de Repetição',
      descricao: 'Automatizando tarefas com For, While e Do-While.',
      status: 'bloqueado',
      aulas: [
        { titulo: 'Laços Contados (For)', tipo: 'video', concluida: false },
        { titulo: 'Laços Condicionais (While)', tipo: 'video', concluida: false },
        { titulo: 'FizzBuzz Challenge', tipo: 'exercicio', concluida: false },
      ]
    },
    {
      id: 4,
      titulo: 'Vetores e Matrizes',
      descricao: 'Trabalhando com coleções de dados.',
      status: 'bloqueado',
      aulas: [
        { titulo: 'Introdução a Arrays', tipo: 'video', concluida: false },
        { titulo: 'Manipulação de Listas', tipo: 'leitura', concluida: false },
        { titulo: 'Matrizes Bi-dimensionais', tipo: 'video', concluida: false },
      ]
    }
  ]);

  progressoTotal = signal<number>(35); // Exemplo: 35% concluído
}
