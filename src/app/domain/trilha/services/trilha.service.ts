import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Playlist } from '../models/playlist.interface';
import { PlaylistRequest } from '../models/playlist-request.interface';

@Injectable({
  providedIn: 'root',
})
export class TrilhaService {
  private readonly API = `${environment.apiUrl}/playlists`;
  private http = inject(HttpClient);

  list(classroomId?: number): Observable<Playlist[]> {
    let params = new HttpParams();
    if (classroomId) {
      params = params.set('classroom_id', classroomId.toString());
    }
    return this.http.get<Playlist[]>(this.API, { params });
  }

  getById(id: number): Observable<Playlist> {
    return this.http.get<Playlist>(`${this.API}/${id}`);
  }

  // TODO: Integração Backend - Rails exige o envelopamento 'playlist' e permissão de 'question_ids' nos strong params
  create(data: PlaylistRequest): Observable<Playlist> {
    return this.http.post<Playlist>(this.API, { playlist: data });
  }

  // TODO: Integração Backend - Rails exige o envelopamento 'playlist' e permissão de 'question_ids' nos strong params
  update(id: number, data: Partial<PlaylistRequest>): Observable<Playlist> {
    return this.http.patch<Playlist>(`${this.API}/${id}`, { playlist: data });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
