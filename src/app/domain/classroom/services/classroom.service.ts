import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
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

  list(): Observable<Classroom[]> {
    return this.http.get<Classroom[]>(this.API);
  }

  create(data: ClassroomRequest): Observable<Classroom> {
    return this.http.post<Classroom>(this.API, data);
  }

  join(data: JoinRequest): Observable<any> {
    return this.http.post<any>(`${this.API}/join`, data);
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
