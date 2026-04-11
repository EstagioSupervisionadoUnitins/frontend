import { Injectable, signal } from '@angular/core';
import { ExercicioDetalhe, FeedbackIA } from '../models/exercicio.model';

@Injectable({
  providedIn: 'root'
})
export class ExercicioMockService {
  
  // Exercício mockado para a tela
  exercicioDetalhe = signal<ExercicioDetalhe>({
    id: 1,
    titulo: 'Calculadora de Média',
    descricao: `
      Neste exercício, você deve criar uma função chamada <code>calcularMedia</code> que recebe um array de números e retorna a média deles.
      <br/><br/>
      <strong>Regras:</strong>
      <ul>
        <li>A função deve receber um array numérico.</li>
        <li>Se o array estiver vazio, retorne 0.</li>
        <li>Utilize estruturas de repetição (for ou while) para somar os valores.</li>
      </ul>
    `,
    codigoBase: 'def calcular_media(notas):\n  # Escreva seu código aqui\n  \n}',
    linguagem: 'python'
  });

  // Estado da avaliação
  avaliando = signal<boolean>(false);
  feedback = signal<FeedbackIA | null>(null);

  avaliarCodigo(codigo: string): void {
    this.avaliando.set(true);
    this.feedback.set(null);

    // Simulando tempo de resposta da IA
    setTimeout(() => {
      this.avaliando.set(false);
      
      // Lógica super simples para mockar sucesso ou falha
      if (codigo.includes('return') && codigo.includes('length')) {
        this.feedback.set({
          sucesso: true,
          mensagem: 'Excelente! Seu código atende a todos os requisitos. A lógica está bem estruturada e calcula a média corretamente.'
        });
      } else {
        this.feedback.set({
          sucesso: false,
          mensagem: 'Seu código parece estar incompleto ou não retorna o valor esperado.',
          dicas: [
            'Lembre-se de usar a palavra-chave "return" para devolver a média calculada.',
            'Você pode usar "nomeDoArray.length" para saber o total de itens para divisão.'
          ]
        });
      }
    }, 2500); // 2.5s delay
  }
}
