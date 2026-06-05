import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';

import { SubmissionService } from '../../../domain/submission/services/submission.service';
import { Submission } from '../../../domain/submission/models/submission.interface';

@Component({
  selector: 'app-submissoes-suspeitas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonModule,
    CardModule,
    ToastModule,
    TableModule,
    DialogModule,
    TextareaModule,
    TooltipModule
  ],
  providers: [MessageService],
  templateUrl: './submissoes.html',
  styleUrl: './submissoes.css'
})
export class SubmissoesSuspeitas implements OnInit {
  private submissionService = inject(SubmissionService);
  private messageService = inject(MessageService);

  submissions = signal<Submission[]>([]);
  loading = signal(true);

  // Anulamento modal state
  displayAnnulModal = signal(false);
  annulReason = signal('');
  selectedSubmission = signal<Submission | null>(null);
  isSaving = signal(false);

  ngOnInit(): void {
    this.loadSubmissions();
  }

  loadSubmissions(): void {
    this.loading.set(true);
    this.submissionService.listSuspicious().subscribe({
      next: (data) => {
        this.submissions.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar submissões suspeitas:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar as submissões suspeitas.'
        });
        this.loading.set(false);
      }
    });
  }

  openAnnulModal(submission: Submission): void {
    this.selectedSubmission.set(submission);
    this.annulReason.set('');
    this.displayAnnulModal.set(true);
  }

  annulSubmission(): void {
    const sub = this.selectedSubmission();
    if (!sub) return;

    if (!this.annulReason().trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Por favor, insira uma justificativa para a anulação.'
      });
      return;
    }

    this.isSaving.set(true);
    this.submissionService.annul(sub.id, this.annulReason()).subscribe({
      next: (updatedSub) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Anulada',
          detail: 'A pontuação desta submissão foi anulada com sucesso.'
        });
        this.displayAnnulModal.set(false);
        this.isSaving.set(false);
        // Atualiza o registro local
        this.submissions.update((list) => 
          list.map((item) => (item.id === updatedSub.id ? updatedSub : item))
        );
      },
      error: (err) => {
        console.error('Erro ao anular submissão:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.error || 'Não foi possível anular a submissão.'
        });
        this.isSaving.set(false);
      }
    });
  }

  translateFlag(flag: string): string {
    const dict: Record<string, string> = {
      'paste_detected': 'Colagem suspeita',
      'tab_switch_detected': 'Troca de aba',
      'time_anomaly': 'Tempo muito curto',
      'code_similarity': 'Similaridade de código'
    };
    return dict[flag] || flag;
  }
}
