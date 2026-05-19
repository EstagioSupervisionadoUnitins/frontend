import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SystemHealth } from '../models/system-health.interface';
import { SKIP_GLOBAL_ERROR } from '../../../core/interceptors/error.interceptor';

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  private http = inject(HttpClient);

  getHealth(): Observable<SystemHealth> {
    const startTime = Date.now();
    return this.http.get<SystemHealth>(`${environment.apiUrl}/health`, {
      context: new HttpContext().set(SKIP_GLOBAL_ERROR, true)
    }).pipe(
      map(response => {
        const endTime = Date.now();
        return {
          ...response,
          latency: endTime - startTime
        };
      })
    );
  }
}
