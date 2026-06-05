import { Component, computed, inject } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { TrilhaService } from '../../domain/trilha/services/trilha.service';
import { ClassroomService } from '../../domain/classroom/services/classroom.service';
import { TrilhaHeader } from './components/trilha-header/trilha-header';
import { TrilhaTimeline } from './components/trilha-timeline/trilha-timeline';
import { switchMap, of } from 'rxjs';
import { Playlist } from '../../domain/trilha/models/playlist.interface';

@Component({
  selector: 'app-trilha',
  imports: [TrilhaHeader, TrilhaTimeline],
  templateUrl: './trilha.html',
  styleUrl: './trilha.css',
})
export class Trilha {
  private trilhaService = inject(TrilhaService);
  private classroomService = inject(ClassroomService);
  
  activeClassroom = this.classroomService.activeClassroom;

  playlists = toSignal(
    toObservable(this.activeClassroom).pipe(
      switchMap(classroom => {
        if (!classroom) return of([]);
        return this.trilhaService.list(classroom.id);
      })
    ),
    { initialValue: [] as Playlist[] }
  );

  progressoTotal = computed(() => {
    const allPlaylists = this.playlists();
    if (!allPlaylists || allPlaylists.length === 0) return 0;

    let totalQuestions = 0;
    let answeredQuestions = 0;

    allPlaylists.forEach((p: Playlist) => {
      if (p.questions) {
        totalQuestions += p.questions.length;
        answeredQuestions += p.questions.filter(q => q.answered).length;
      }
    });

    return totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
  });
}
