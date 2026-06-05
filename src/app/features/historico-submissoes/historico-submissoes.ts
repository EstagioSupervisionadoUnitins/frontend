import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SelectModule } from 'primeng/select';
import { RouterLink } from '@angular/router';
import { SubmissionService } from '../../domain/submission/services/submission.service';
import { Submission } from '../../domain/submission/models/submission.interface';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-historico-submissoes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    TagModule,
    DialogModule,
    ButtonModule,
    TooltipModule,
    SelectModule,
    RouterLink
  ],
  templateUrl: './historico-submissoes.html',
  styleUrl: './historico-submissoes.css'
})
export class HistoricoSubmissoes implements OnInit {
  private submissionService = inject(SubmissionService);
  private toastService = inject(ToastService);

  rawSubmissions = signal<Submission[]>([]);
  filterResult = signal<string>('ALL');
  loading = signal(false);

  filterOptions = [
    { label: 'Todos os resultados', value: 'ALL' },
    { label: 'Apenas corretos', value: 'CORRECT' },
    { label: 'Apenas incorretos', value: 'INCORRECT' }
  ];

  submissions = computed(() => {
    const raw = this.rawSubmissions();
    const filter = this.filterResult();

    if (filter === 'CORRECT') {
      return raw.filter(sub => sub.status === 'completed' && sub.is_correct);
    }
    if (filter === 'INCORRECT') {
      return raw.filter(sub => sub.status === 'completed' && !sub.is_correct);
    }
    return raw;
  });

  // Modal para detalhe da submissão
  displayDetailModal = signal(false);
  selectedSubmission = signal<Submission | null>(null);

  ngOnInit(): void {
    this.loadSubmissions();
  }

  loadSubmissions(): void {
    this.loading.set(true);
    this.submissionService.list().subscribe({
      next: (data) => {
        // Ordena por data decrescente (mais recente primeiro)
        const sorted = data.sort((a, b) => {
          if (!a.created_at || !b.created_at) return 0;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        this.rawSubmissions.set(sorted);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('[HistoricoSubmissoes] Erro ao carregar histórico:', err);
        this.toastService.showError('Erro', 'Não foi possível carregar seu histórico de submissões.');
        this.loading.set(false);
      }
    });
  }

  openDetails(submission: Submission): void {
    this.selectedSubmission.set(submission);
    this.displayDetailModal.set(true);
  }

  closeDetails(): void {
    this.displayDetailModal.set(false);
    this.selectedSubmission.set(null);
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'info';
      case 'processing': return 'warn';
      case 'error': return 'danger';
      default: return 'secondary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'pending': return 'Pendente';
      case 'processing': return 'Processando';
      case 'error': return 'Erro';
      default: return status;
    }
  }

  truncateCode(code: string, maxLength: number = 60): string {
    if (!code) return '';
    // Remove quebras de linha múltiplas e espaços extras para exibição na tabela
    const cleanCode = code.replace(/\s+/g, ' ').trim();
    if (cleanCode.length <= maxLength) return cleanCode;
    return cleanCode.substring(0, maxLength) + '...';
  }
}
