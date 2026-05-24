import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { forkJoin } from 'rxjs';

import { ClassroomService } from '../../../domain/classroom/services/classroom.service';
import { TrilhaService } from '../../../domain/trilha/services/trilha.service';
import { Classroom } from '../../../domain/classroom/models/classroom.interface';
import { ClassroomStats } from '../../../domain/classroom/models/classroom-stats.interface';
import { PlaylistClassroomStats } from '../../../domain/trilha/models/playlist-classroom-stats.interface';
import { ClassroomStudent } from '../../../domain/classroom/models/classroom-student.interface';

import { TurmaResumo } from './components/turma-resumo/turma-resumo';
import { AlunosLista } from './components/alunos-lista/alunos-lista';
import { TrilhasResumo } from './components/trilhas-resumo/trilhas-resumo';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-professor',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    SelectModule, 
    ButtonModule, 
    TurmaResumo, 
    AlunosLista, 
    TrilhasResumo,
    RouterLink
  ],
  templateUrl: './dashboard-professor.html',
  styleUrl: './dashboard-professor.css',
})
export class DashboardProfessor implements OnInit {
  private classroomService = inject(ClassroomService);
  private trilhaService = inject(TrilhaService);

  classrooms = signal<Classroom[]>([]);
  selectedClassroom: Classroom | null = null;
  loading = signal<boolean>(true);
  
  classroomStats = signal<ClassroomStats | null>(null);
  playlistStats = signal<PlaylistClassroomStats | null>(null);
  allStudents = signal<ClassroomStudent[]>([]);

  ngOnInit(): void {
    this.loadClassrooms();
  }

  loadClassrooms(): void {
    this.loading.set(true);
    this.classroomService.list().subscribe({
      next: (data) => {
        this.classrooms.set(data);
        if (data.length > 0) {
          this.selectedClassroom = data[0];
          this.loadDashboardData();
        } else {
          this.loading.set(false);
        }
      },
      error: () => this.loading.set(false)
    });
  }

  onClassroomChange(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    if (!this.selectedClassroom) return;

    this.loading.set(true);
    const id = this.selectedClassroom.id;

    forkJoin({
      stats: this.classroomService.getStats(id),
      playlists: this.trilhaService.getClassroomStats(id),
      students: this.classroomService.getStudents(id)
    }).subscribe({
      next: (results) => {
        this.classroomStats.set(results.stats);
        this.playlistStats.set(results.playlists);
        this.allStudents.set(results.students || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar dados do dashboard:', err);
        this.loading.set(false);
      }
    });
  }
}
