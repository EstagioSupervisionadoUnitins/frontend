import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Classroom } from '../models/classroom.interface';
import { ClassroomRequest } from '../models/classroom-request.interface';
import { JoinRequest } from '../models/join-request.interface';

@Injectable({
  providedIn: 'root',
})
export class ClassroomService {
  private readonly API = `${environment.apiUrl}/classrooms`;
  private http = inject(HttpClient);

  // Estado da turma ativa
  private activeClassroomSignal = signal<Classroom | null>(this.loadFromStorage());

  activeClassroom = this.activeClassroomSignal.asReadonly();

  list(): Observable<Classroom[]> {
    return this.http.get<Classroom[]>(this.API);
  }

  getById(id: number | string): Observable<Classroom> {
    return this.http.get<Classroom>(`${this.API}/${id}`);
  }

  getStats(id: number | string): Observable<any> {
    return this.http.get<any>(`${this.API}/${id}/stats`);
  }

  create(data: ClassroomRequest): Observable<Classroom> {
    return this.http.post<Classroom>(this.API, data);
  }

  join(data: JoinRequest): Observable<Classroom> {
    return this.http.post<Classroom>(`${this.API}/join`, data);
  }

  setActiveClassroom(data: any | null): void {
    if (data) {
      // A API pode retornar { message: string, classroom: Classroom } ou apenas Classroom
      const classroom = data.classroom || (data.id ? data : null);
      
      if (classroom) {
        // Remove campos indesejados se existirem (ex: 'message' no nível da turma)
        const { message, ...cleanClassroom } = classroom;
        this.activeClassroomSignal.set(cleanClassroom);
        localStorage.setItem('active_classroom', JSON.stringify(cleanClassroom));
      } else {
        this.clearActiveClassroom();
      }
    } else {
      this.clearActiveClassroom();
    }
  }

  private clearActiveClassroom(): void {
    this.activeClassroomSignal.set(null);
    localStorage.removeItem('active_classroom');
  }

  private loadFromStorage(): Classroom | null {
    const saved = localStorage.getItem('active_classroom');
    return saved ? JSON.parse(saved) : null;
  }

  generateCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'LOG-';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
