import { Component, inject } from '@angular/core';
import { TrilhaMockService } from '../../domain/aluno/services/trilha-mock.service';
import { TrilhaHeader } from './components/trilha-header/trilha-header';
import { TrilhaTimeline } from './components/trilha-timeline/trilha-timeline';

@Component({
  selector: 'app-trilha',
  imports: [TrilhaHeader, TrilhaTimeline],
  templateUrl: './trilha.html',
  styleUrl: './trilha.css',
})
export class Trilha {
  private trilhaService = inject(TrilhaMockService);
  
  modulos = this.trilhaService.modulos;
  progressoTotal = this.trilhaService.progressoTotal;
}
