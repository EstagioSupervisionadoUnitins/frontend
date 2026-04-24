import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { RankingService } from '../../domain/ranking/services/ranking.service';
import { Ranking } from '../../domain/ranking/models/ranking.interface';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './ranking.html',
  styleUrl: './ranking.css',
})
export class RankingPage implements OnInit {
  private rankingService = inject(RankingService);
  private toastService = inject(ToastService);

  leaderboard = signal<Ranking[]>([]);
  loading = signal(false);

  ngOnInit(): void {
    this.loadRanking();
  }

  loadRanking(): void {
    this.loading.set(true);
    this.rankingService.getLeaderboard().subscribe({
      next: (data) => {
        this.leaderboard.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('[Ranking] Erro ao carregar leaderboard:', err);
        this.toastService.showError('Erro', 'Não foi possível carregar o ranking.');
        this.loading.set(false);
      }
    });
  }
}
