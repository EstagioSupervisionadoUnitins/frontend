import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TrilhaService } from '../../../domain/trilha/services/trilha.service';
import { Playlist } from '../../../domain/trilha/models/playlist.interface';
import { ClassroomService } from '../../../domain/classroom/services/classroom.service';
import { Classroom } from '../../../domain/classroom/models/classroom.interface';

@Component({
  selector: 'app-trilhas-professor',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, ToastModule, SelectModule, FormsModule],
  providers: [MessageService],
  templateUrl: './trilhas-professor.html',
  styleUrl: './trilhas-professor.css'
})
export class TrilhasProfessor implements OnInit {
  private trilhaService = inject(TrilhaService);
  private classroomService = inject(ClassroomService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  
  playlists = signal<Playlist[]>([]);
  classrooms = signal<Classroom[]>([]);
  selectedClassroomId = signal<number | null>(null);
  loading = signal(false);
  loadingClassrooms = signal(false);

  ngOnInit(): void {
    this.loadClassrooms();
  }

  loadClassrooms(): void {
    this.loadingClassrooms.set(true);
    this.classroomService.list().subscribe({
      next: (data) => {
        this.classrooms.set(data);
        if (data.length > 0) {
          this.selectedClassroomId.set(data[0].id);
          this.loadPlaylists();
        }
        this.loadingClassrooms.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar turmas.' });
        this.loadingClassrooms.set(false);
      }
    });
  }

  loadPlaylists(): void {
    const classroomId = this.selectedClassroomId();
    if (!classroomId) return;

    this.loading.set(true);
    this.trilhaService.list(classroomId).subscribe({
      next: (data) => {
        this.playlists.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar trilhas.' });
        this.loading.set(false);
      }
    });
  }

  onClassroomChange(): void {
    this.loadPlaylists();
  }

  novaTrilha(): void {
    this.router.navigate(['/professor/trilhas/nova']);
  }

  editarTrilha(id: number): void {
    this.router.navigate(['/professor/trilhas', id, 'editar']);
  }

  verAnalytics(id: number): void {
    this.router.navigate(['/professor/trilhas', id, 'analytics']);
  }

  excluirTrilha(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta trilha?')) {
      this.trilhaService.delete(id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Trilha excluída com sucesso!' });
          this.loadPlaylists();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir trilha.' });
        }
      });
    }
  }
}
