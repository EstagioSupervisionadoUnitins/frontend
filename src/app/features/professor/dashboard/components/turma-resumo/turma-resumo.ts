import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassroomStats } from '../../../../../domain/classroom/models/classroom-stats.interface';

@Component({
  selector: 'app-turma-resumo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './turma-resumo.html',
})
export class TurmaResumo {
  @Input() stats: ClassroomStats | null = null;
}
