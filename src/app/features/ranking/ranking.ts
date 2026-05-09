import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AvatarModule } from 'primeng/avatar';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { toSignal } from '@angular/core/rxjs-interop';
import { RankingService } from '../../domain/ranking/services/ranking.service';
import { Ranking } from '../../domain/ranking/models/ranking.interface';
import { ToastService } from '../../shared/services/toast.service';
import { ClassroomService } from '../../domain/classroom/services/classroom.service';
import { AuthService } from '../../domain/auth/service/auth.service';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [
    CommonModule, 
    TableModule, 
    SelectButtonModule, 
    FormsModule,
    AvatarModule,
    SkeletonModule,
    TagModule
  ],
  templateUrl: './ranking.html',
  styleUrl: './ranking.css',
})
export class RankingPage implements OnInit {
  private rankingService = inject(RankingService);
  private toastService = inject(ToastService);
  private classroomService = inject(ClassroomService);
  private authService = inject(AuthService);

  leaderboard = signal<Ranking[]>([]);
  loading = signal(false);

  currentUser = toSignal(this.authService.usuario$);

  top3 = computed(() => {
    return this.leaderboard().slice(0, 3);
  });

  remaining = computed(() => {
    return this.leaderboard().slice(3);
  });

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

  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  isCurrentUser(name: string): boolean {
    const user = this.currentUser();
    return user?.username === name;
  }
}
