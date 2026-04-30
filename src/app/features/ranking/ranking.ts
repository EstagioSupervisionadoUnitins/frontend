import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { SelectButtonModule } from 'primeng/selectbutton';
import { RankingService } from '../../domain/ranking/services/ranking.service';
import { Ranking } from '../../domain/ranking/models/ranking.interface';
import { ToastService } from '../../shared/services/toast.service';
import { ClassroomService } from '../../domain/classroom/services/classroom.service';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule, TableModule, SelectButtonModule, FormsModule],
  templateUrl: './ranking.html',
  styleUrl: './ranking.css',
})
export class RankingPage implements OnInit {
  private rankingService = inject(RankingService);
  private toastService = inject(ToastService);
  private classroomService = inject(ClassroomService);

  leaderboard = signal<Ranking[]>([]);
  loading = signal(false);

  scopeOptions = [
    { label: 'Minha Turma', value: 'turma' },
    { label: 'Global', value: 'global' }
  ];
  scope = signal<'turma' | 'global'>('turma');

  ngOnInit(): void {
    const activeClassroom = this.classroomService.activeClassroom();
    
    if (!activeClassroom) {
      this.scope.set('global');
      // Remove a opção "Minha Turma" se não houver turma ativa
      this.scopeOptions = this.scopeOptions.filter(opt => opt.value !== 'turma');
    }

    this.loadRanking();
  }

  loadRanking(): void {
    this.loading.set(true);
    
    let classroomId: number | undefined;
    if (this.scope() === 'turma') {
      classroomId = this.classroomService.activeClassroom()?.id;
    }

    this.rankingService.getLeaderboard(classroomId).subscribe({
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
