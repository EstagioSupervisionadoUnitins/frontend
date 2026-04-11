import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AlunoMockService } from '../../../../domain/aluno/services/aluno-mock.service';

@Component({
  selector: 'app-insight-ia',
  imports: [ButtonModule],
  templateUrl: './insight-ia.html',
  styleUrl: './insight-ia.css',
})
export class InsightIa {
  private alunoService = inject(AlunoMockService);
  insight = this.alunoService.insightIA;
}
