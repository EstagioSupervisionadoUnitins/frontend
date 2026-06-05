import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PlaylistOverview } from '../../../../../domain/trilha/models/playlist-classroom-stats.interface';

@Component({
  selector: 'app-trilhas-resumo',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './trilhas-resumo.html',
})
export class TrilhasResumo {
  @Input() playlists: PlaylistOverview[] = [];

  getPercentage(finished: number, started: number): number {
    if (started === 0) return 0;
    return (finished / started) * 100;
  }

  getRemainingPercentage(finished: number, started: number): number {
    if (started === 0) return 0;
    return ((started - finished) / started) * 100;
  }
}
