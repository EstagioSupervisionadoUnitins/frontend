import { Component, input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Playlist } from '../../../../domain/trilha/models/playlist.interface';

@Component({
  selector: 'app-trilha-timeline',
  imports: [],
  templateUrl: './trilha-timeline.html',
  styleUrl: './trilha-timeline.css',
})
export class TrilhaTimeline {
  private router = inject(Router);
  playlists = input.required<Playlist[]>();

  getPlaylistStatus(playlist: Playlist): string {
    const questions = playlist.questions || [];
    const total = questions.length;
    if (total === 0) return 'nao_iniciada';
    
    const answered = questions.filter(q => q.answered).length;
    
    if (answered === total) return 'concluido';
    if (answered > 0) return 'em_andamento';
    return 'nao_iniciada';
  }

  isPlaylistLocked(index: number): boolean {
    if (index === 0) return false;
    
    const previousPlaylist = this.playlists()[index - 1];
    return this.getPlaylistStatus(previousPlaylist) !== 'concluido';
  }

  getStatusClass(playlist: Playlist, index: number): string {
    if (this.isPlaylistLocked(index)) {
      return 'bg-slate-50 border-slate-200 text-slate-400 opacity-60 select-none pointer-events-none';
    }

    const status = this.getPlaylistStatus(playlist);
    const classes: Record<string, string> = {
      concluido: 'bg-green-50 border-green-200 text-green-700',
      em_andamento: 'bg-blue-50 border-blue-200 text-blue-700',
      nao_iniciada: 'bg-slate-50 border-slate-200 text-slate-600',
    };
    return classes[status] || 'bg-slate-50 border-slate-200';
  }

  getDotClass(playlist: Playlist, index: number): string {
    if (this.isPlaylistLocked(index)) {
      return 'bg-slate-200 ring-slate-100 text-slate-400';
    }

    const status = this.getPlaylistStatus(playlist);
    const classes: Record<string, string> = {
      concluido: 'bg-green-500 ring-green-200',
      em_andamento: 'bg-blue-500 ring-blue-100 animate-pulse',
      nao_iniciada: 'bg-slate-300 ring-slate-100',
    };
    return classes[status] || 'bg-slate-300';
  }

  continuar(playlist: Playlist): void {
    const questions = playlist.questions || [];
    const nextQuestion = questions.find(q => !q.answered) || questions[0];
    if (nextQuestion) {
      this.router.navigate(['/aluno/exercicio', nextQuestion.id], {
        queryParams: { playlist_id: playlist.id }
      });
    }
  }
}
