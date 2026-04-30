import { Component, inject, computed } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AlunoService } from '../../../../domain/aluno/services/aluno.service';

@Component({
  selector: 'app-insight-ia',
  imports: [ButtonModule],
  templateUrl: './insight-ia.html',
  styleUrl: './insight-ia.css',
})
export class InsightIa {
  private alunoService = inject(AlunoService);
  stats = this.alunoService.stats;

  insight = computed(() => {
    const s = this.stats();
    if (!s) return 'Analisando seu desempenho...';
    
    if (s.questions_attempted === 0) {
      return 'Você ainda não resolveu nenhum exercício. Que tal começar a praticar na sua turma agora mesmo?';
    }

    const accuracy = Math.round((s.questions_solved / s.questions_attempted) * 100);
    
    if (accuracy >= 80) {
      return `Excelente trabalho! Você tem uma taxa de acerto de ${accuracy}%. Continue mantendo esse ritmo incrível.`;
    } else if (accuracy >= 50) {
      return `Você está no caminho certo com ${accuracy}% de acerto. Revisar os exercícios que você errou pode ajudar a melhorar ainda mais.`;
    } else {
      return `Não desanime! A programação exige prática. Revisite os conceitos básicos e tente os exercícios novamente.`;
    }
  });
}
