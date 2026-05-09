import { Component, input, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Submission } from '../../../../domain/submission/models/submission.interface';
import { Question } from '../../../../domain/question/models/question.interface';
import { DifficultyPipe } from '../../../../shared/pipes/difficulty.pipe';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-painel-instrucao',
  imports: [CommonModule, DifficultyPipe, MarkdownComponent],
  templateUrl: './painel-instrucao.html',
  styleUrl: './painel-instrucao.css',
})
export class PainelInstrucao {
  question = input.required<Question>();
  feedback = input<Submission | null>(null);
  avaliando = input<boolean>(false);
  proximaQuestaoId = input<number | null>(null);
  
  private location = inject(Location);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  voltar(): void {
    this.location.back();
  }

  irParaTrilhas(): void {
    this.router.navigate(['/aluno/trilhas']);
  }

  irParaProxima(): void {
    const nextId = this.proximaQuestaoId();
    if (nextId) {
      const playlistId = this.route.snapshot.queryParamMap.get('playlist_id');
      if (playlistId) {
        this.router.navigate(['/aluno/exercicio', nextId], {
          queryParams: { playlist_id: playlistId }
        });
      } else {
        this.router.navigate(['/aluno/exercicio', nextId]);
      }
    }
  }
}
