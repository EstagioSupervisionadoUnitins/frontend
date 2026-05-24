import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { StudentNeedingAttention, RecentSubmission } from '../../../../../domain/classroom/models/classroom-stats.interface';
import { ClassroomStudent } from '../../../../../domain/classroom/models/classroom-student.interface';

@Component({
  selector: 'app-alunos-lista',
  standalone: true,
  imports: [CommonModule, TableModule, TooltipModule],
  templateUrl: './alunos-lista.html',
  styleUrl: './alunos-lista.css',
})
export class AlunosLista {
  @Input() studentsAttention: StudentNeedingAttention[] = [];
  @Input() recentSubmissions: RecentSubmission[] = [];
  @Input() allStudents: ClassroomStudent[] = [];
}
