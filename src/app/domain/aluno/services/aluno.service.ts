import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { UserStats } from '../models/user-stats.interface';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlunoService {
  private http = inject(HttpClient);
  
  private _stats = signal<UserStats | null>(null);
  public stats = this._stats.asReadonly();

  getStats(): Observable<UserStats> {
    return this.http.get<UserStats>(`${environment.apiUrl}/user/stats`).pipe(
      tap((data) => this._stats.set(data))
    );
  }
}
