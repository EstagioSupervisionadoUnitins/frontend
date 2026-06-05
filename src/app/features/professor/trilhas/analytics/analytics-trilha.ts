import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TrilhaService } from '../../../../domain/trilha/services/trilha.service';
import { PlaylistDetailedStats, UserPlaylistStat } from '../../../../domain/trilha/models/playlist-detailed-stats.interface';

@Component({
  selector: 'app-analytics-trilha',
  standalone: true,
  imports: [CommonModule, ChartModule, TableModule, ButtonModule, ToastModule, RouterModule],
  providers: [MessageService],
  templateUrl: './analytics-trilha.html'
})
export class AnalyticsTrilha implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private trilhaService = inject(TrilhaService);
  private messageService = inject(MessageService);

  loading = signal(true);
  stats = signal<PlaylistDetailedStats | null>(null);

  // Computeds for charts
  barChartData = computed(() => {
    const data = this.stats();
    if (!data || !data.question_stats) return null;

    // Sort by total errors descending
    const sortedQuestions = [...data.question_stats].sort((a, b) => b.total_errors - a.total_errors);

    return {
      labels: sortedQuestions.map(q => q.title),
      datasets: [
        {
          label: 'Total de Erros',
          backgroundColor: '#EF4444', // Tailwind red-500
          data: sortedQuestions.map(q => q.total_errors)
        }
      ]
    };
  });

  barChartOptions = {
    indexAxis: 'y',
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: {
        labels: {
          color: '#495057'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#495057',
          font: {
            weight: 500
          }
        },
        grid: {
          color: '#ebedef'
        }
      },
      y: {
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      }
    }
  };

  getUserStatus(user: UserPlaylistStat): string {
    if (user.completion_percentage === 100) return 'completed';
    if (user.completion_percentage === 0 && user.incorrect_attempts === 0 && user.correct_questions === 0) return 'not_started';
    return 'in_progress';
  }

  donutChartData = computed(() => {
    const data = this.stats();
    if (!data || !data.user_stats) return null;

    let completed = 0;
    let inProgress = 0;
    let notStarted = 0;

    data.user_stats.forEach(user => {
      const status = this.getUserStatus(user);
      if (status === 'completed') completed++;
      else if (status === 'in_progress') inProgress++;
      else notStarted++;
    });

    return {
      labels: ['Concluído', 'Em Andamento', 'Não Iniciado'],
      datasets: [
        {
          data: [completed, inProgress, notStarted],
          backgroundColor: [
            '#10B981', // emerald-500
            '#F59E0B', // amber-500
            '#9CA3AF'  // gray-400
          ],
          hoverBackgroundColor: [
            '#059669', // emerald-600
            '#D97706', // amber-600
            '#6B7280'  // gray-500
          ]
        }
      ]
    };
  });

  donutChartOptions = {
    cutout: '60%',
    plugins: {
      legend: {
        labels: {
          color: '#495057'
        }
      }
    }
  };

  // Computeds for Summary Cards
  totalAlunos = computed(() => this.stats()?.user_stats.length || 0);
  alunosConcluidos = computed(() => this.stats()?.user_stats.filter(u => this.getUserStatus(u) === 'completed').length || 0);
  alunosEmAndamento = computed(() => this.stats()?.user_stats.filter(u => this.getUserStatus(u) === 'in_progress').length || 0);
  alunosNaoIniciados = computed(() => this.stats()?.user_stats.filter(u => this.getUserStatus(u) === 'not_started').length || 0);


  ngOnInit(): void {
    const playlistId = Number(this.route.snapshot.paramMap.get('id'));
    if (playlistId) {
      this.loadStats(playlistId);
    } else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'ID da trilha inválido.' });
      this.loading.set(false);
    }
  }

  loadStats(playlistId: number): void {
    this.loading.set(true);
    this.trilhaService.getDetailedStats(playlistId).subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar as estatísticas da trilha.' });
        this.loading.set(false);
      }
    });
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'in_progress': return 'Em andamento';
      case 'not_started': return 'Não iniciado';
      default: return status;
    }
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warn';
      case 'not_started': return 'secondary';
      default: return 'info';
    }
  }
}
