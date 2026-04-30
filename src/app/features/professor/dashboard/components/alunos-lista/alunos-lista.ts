import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { StudentNeedingAttention, RecentSubmission } from '../../../../../domain/classroom/models/classroom-stats.interface';

@Component({
  selector: 'app-alunos-lista',
  standalone: true,
  imports: [CommonModule, TableModule, TooltipModule],
  templateUrl: './alunos-lista.html',
  styleUrl: './alunos-lista.css',
})
export class AlunosLista {
  @Input() studentsAttention: StudentNeedingAttention[] = [];
  /**
   * TODO: Quando o backend for atualizado para retornar student_name e question_title
   * em recent_submissions, atualizar o template HTML para exibir esses nomes em vez dos IDs.
   */
  @Input() recentSubmissions: RecentSubmission[] = [];
}
