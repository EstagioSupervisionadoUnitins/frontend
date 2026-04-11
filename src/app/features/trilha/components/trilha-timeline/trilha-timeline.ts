import { Component, input } from '@angular/core';
import { Modulo } from '../../../../domain/aluno/models/trilha.model';

@Component({
  selector: 'app-trilha-timeline',
  imports: [],
  templateUrl: './trilha-timeline.html',
  styleUrl: './trilha-timeline.css',
})
export class TrilhaTimeline {
  modulos = input.required<Modulo[]>();

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      concluido: 'bg-green-50 border-green-200 text-green-700',
      em_andamento: 'bg-blue-50 border-blue-200 text-blue-700',
      bloqueado: 'bg-slate-50 border-slate-200 text-slate-400 opacity-60',
    };
    return classes[status] || 'bg-slate-50 border-slate-200';
  }

  getDotClass(status: string): string {
    const classes: Record<string, string> = {
      concluido: 'bg-green-500 ring-green-200',
      em_andamento: 'bg-blue-500 ring-blue-100 animate-pulse',
      bloqueado: 'bg-slate-300 ring-slate-100',
    };
    return classes[status] || 'bg-slate-300';
  }
}
