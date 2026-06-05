import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SystemService } from '../../../domain/system/services/system.service';
import { SystemHealth } from '../../../domain/system/models/system-health.interface';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-status-admin',
  imports: [CommonModule, ButtonModule],
  templateUrl: './status-admin.html',
  styleUrl: './status-admin.css'
})
export class StatusAdmin implements OnInit {
  private systemService = inject(SystemService);
  private toastService = inject(ToastService);

  health = signal<SystemHealth | null>(null);
  loading = signal(false);
  currentDate = new Date();

  ngOnInit() {
    this.verificarSaude();
  }

  verificarSaude() {
    this.loading.set(true);
    this.systemService.getHealth().subscribe({
      next: (data) => {
        this.health.set({
          ...data,
          status: data.status || 'ok'
        });
        this.currentDate = new Date();
        this.loading.set(false);
        this.toastService.showSuccess('Status do sistema atualizado.');
      },
      error: (err) => {
        console.error('Falha ao checar integridade do sistema:', err);
        this.health.set({
          status: 'error',
          services: {
            database: { status: 'down' },
            gemini: { status: 'disconnected' },
            n8n: { status: 'disconnected' },
            smtp: { status: 'disconnected' }
          },
          latency: 0
        });
        this.loading.set(false);
        this.toastService.showError('Não foi possível conectar à API de monitoramento.');
      }
    });
  }
}
