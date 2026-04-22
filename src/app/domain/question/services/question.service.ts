import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Question } from '../models/question.interface';
import { QuestionRequest } from '../models/question-request.interface';
import { GenerateRequest } from '../models/generate-request.interface';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/questions`;

  list(): Observable<Question[]> {
    return this.http.get<Question[]>(this.apiUrl);
  }

  getById(id: number): Observable<Question> {
    return this.http.get<Question>(`${this.apiUrl}/${id}`);
  }

  create(req: QuestionRequest): Observable<Question> {
    return this.http.post<Question>(this.apiUrl, req);
  }

  generate(req: GenerateRequest): Observable<Question[]> {
    return this.http.post<Question[]>(`${this.apiUrl}/generate`, req);
  }
}
