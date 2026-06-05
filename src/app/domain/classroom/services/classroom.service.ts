import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Classroom } from '../models/classroom.interface';
import { ClassroomRequest } from '../models/classroom-request.interface';
import { ClassroomRequestUser } from '../models/classroom-request-user.interface';
import { JoinRequest } from '../models/join-request.interface';
import { ClassroomStats } from '../models/classroom-stats.interface';
import { ClassroomStudent } from '../models/classroom-student.interface';
import { SKIP_GLOBAL_ERROR } from '../../../core/interceptors/error.interceptor';

@Injectable({
  providedIn: 'root',
})
export class ClassroomService {
  private readonly API = `${environment.apiUrl}/classrooms`;
  private http = inject(HttpClient);

  // Estado da turma ativa
  private activeClassroomSignal = signal<Classroom | null>(null);
  private loadedSignal = signal(false);

  activeClassroom = this.activeClassroomSignal.asReadonly();
  loaded = this.loadedSignal.asReadonly();

  list(): Observable<Classroom[]> {
    return this.http.get<Classroom[]>(this.API);
  }

  loadActiveClassroom(): Observable<Classroom | null> {
    // Se já carregou, retorna o valor atual
    if (this.loaded()) {
      return of(this.activeClassroom());
    }

    return this.list().pipe(
      map(classrooms => {
        // No MVP o aluno só tem uma turma ativa
        const classroom = classrooms.length > 0 ? classrooms[0] : null;
        this.activeClassroomSignal.set(classroom);
        this.loadedSignal.set(true);
        return classroom;
      })
    );
  }

  getById(id: number | string): Observable<Classroom> {
    return this.http.get<Classroom>(`${this.API}/${id}`);
  }

  getStats(id: number | string): Observable<ClassroomStats> {
    return this.http.get<ClassroomStats>(`${this.API}/${id}/stats`);
  }

  getStudents(id: number | string): Observable<ClassroomStudent[]> {
    return this.http.get<ClassroomStudent[]>(`${this.API}/${id}/students`);
  }

  create(data: ClassroomRequest): Observable<Classroom> {
    return this.http.post<Classroom>(this.API, data);
  }

  join(data: JoinRequest): Observable<any> {
    return this.http.post<any>(`${this.API}/join`, data, {
      context: new HttpContext().set(SKIP_GLOBAL_ERROR, true)
    }).pipe(
      tap(res => {
        const classroom = res.classroom || (res.id ? res : null);
        if (classroom) {
          this.setActiveClassroom(classroom);
        }
      })
    );
  }

  setActiveClassroom(data: any | null): void {
    if (data) {
      const classroom = data.classroom || (data.id ? data : null);
      if (classroom) {
        const { message, ...cleanClassroom } = classroom;
        this.activeClassroomSignal.set(cleanClassroom);
        this.loadedSignal.set(true);
      } else {
        this.clearActiveClassroom();
      }
    } else {
      this.clearActiveClassroom();
    }
  }

  clearActiveClassroom(): void {
    this.activeClassroomSignal.set(null);
    this.loadedSignal.set(false);
  }

  generateCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'LOG-';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  getJoinRequests(classroomId: number | string): Observable<ClassroomRequestUser[]> {
    return this.http.get<ClassroomRequestUser[]>(`${this.API}/${classroomId}/requests`);
  }

  approveJoinRequest(classroomId: number | string, userId: number | string): Observable<any> {
    return this.http.patch<any>(`${this.API}/${classroomId}/requests/${userId}/approve`, {});
  }

  rejectJoinRequest(classroomId: number | string, userId: number | string): Observable<any> {
    return this.http.patch<any>(`${this.API}/${classroomId}/requests/${userId}/reject`, {});
  }
}

