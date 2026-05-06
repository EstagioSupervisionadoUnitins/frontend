import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Question } from '../models/question.interface';
import { QuestionRequest } from '../models/question-request.interface';
import { QuestionUpdate } from '../models/question-update.interface';
import { GenerateRequest } from '../models/generate-request.interface';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/questions`;

  list(classroomId?: number): Observable<Question[]> {
    const params: any = {};
    if (classroomId) {
      params.classroom_id = classroomId;
    }
    return this.http.get<Question[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Question> {
    return this.http.get<Question>(`${this.apiUrl}/${id}`);
  }

  create(req: QuestionRequest): Observable<Question> {
    return this.http.post<Question>(this.apiUrl, req);
  }

  generate(req: GenerateRequest): Observable<{ message: string; log_id: number; status_url: string }> {
    return this.http.post<{ message: string; log_id: number; status_url: string }>(`${this.apiUrl}/generate`, req);
  }

  getGenerationLog(logId: number): Observable<{
    id: number;
    status: 'pending' | 'completed' | 'failed';
    generated_response?: { questions?: Question[] };
    created_at: string;
    updated_at: string;
  }> {
    return this.http.get<{
      id: number;
      status: 'pending' | 'completed' | 'failed';
      generated_response?: { questions?: Question[] };
      created_at: string;
      updated_at: string;
    }>(`${environment.apiUrl}/ai_generation_logs/${logId}`);
  }


  update(id: number, req: QuestionUpdate): Observable<Question> {
    return this.http.patch<Question>(`${this.apiUrl}/${id}`, req);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
