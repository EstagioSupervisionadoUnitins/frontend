import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Ranking } from '../models/ranking.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RankingService {
  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/rankings`;

  /**
   * Retorna o leaderboard global com os top 50 alunos.
   */
  getLeaderboard(): Observable<Ranking[]> {
    return this.http.get<any[]>(this.API).pipe(
      map(data => data.map((item, index) => ({
        position: index + 1,
        user_name: item.name,
        score: item.score || 0
      })))
    );
  }
}
