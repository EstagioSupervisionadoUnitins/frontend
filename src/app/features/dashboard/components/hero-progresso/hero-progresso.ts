import { Component, inject } from '@angular/core';
import { ProgressBar } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { AlunoMockService } from '../../../../domain/aluno/services/aluno-mock.service';

@Component({
  selector: 'app-hero-progresso',
  imports: [ProgressBar, ButtonModule],
  templateUrl: './hero-progresso.html',
  styleUrl: './hero-progresso.css',
})
export class HeroProgresso {
  private alunoService = inject(AlunoMockService);
  progresso = this.alunoService.progresso;
}
