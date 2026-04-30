import { Component, inject, computed } from '@angular/core';
import { ProgressBar } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { AlunoService } from '../../../../domain/aluno/services/aluno.service';

@Component({
  selector: 'app-hero-progresso',
  imports: [ProgressBar, ButtonModule],
  templateUrl: './hero-progresso.html',
  styleUrl: './hero-progresso.css',
})
export class HeroProgresso {
  private alunoService = inject(AlunoService);
  stats = this.alunoService.stats;

  percentual = computed(() => {
    const s = this.stats();
    if (!s || s.questions_attempted === 0) return 0;
    return Math.round((s.questions_solved / s.questions_attempted) * 100);
  });
}
