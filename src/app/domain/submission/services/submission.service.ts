import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { switchMap, takeWhile, filter, timeout } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Submission } from '../models/submission.interface';
import { SubmissionRequest } from '../models/submission-request.interface';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/submissions`;

  /**
   * Lista o histórico de submissões do aluno logado.
   */
  list(): Observable<Submission[]> {
    return this.http.get<Submission[]>(this.apiUrl);
  }

  /**
   * Envia o código para avaliação.
   */
  submit(req: SubmissionRequest): Observable<Submission> {
    return this.http.post<Submission>(this.apiUrl, req);
  }

  /**
   * Consulta o resultado de uma submissão pelo ID.
   */
  getResult(id: number): Observable<Submission> {
    return this.http.get<Submission>(`${this.apiUrl}/${id}`);
  }

  /**
   * Faz polling no endpoint getResult até que o status seja 'completed' ou 'error'.
   * Tenta a cada 3 segundos, com timeout de 60 segundos.
   */
  pollResult(id: number): Observable<Submission> {
    return timer(0, 3000).pipe(
      switchMap(() => this.getResult(id)),
      // Para o polling quando retornar completed ou error, mantendo o último valor emitido
      takeWhile((sub) => sub.status === 'pending' || sub.status === 'processing', true),
      // Filtramos apenas para emitir quando tivermos um resultado final para o componente
      filter((sub) => sub.status === 'completed' || sub.status === 'error'),
      timeout(60000)
    );
  }
}
