import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SKIP_GLOBAL_ERROR } from '../../../core/interceptors/error.interceptor';
import { AdminUser } from '../models/admin-user.interface';
import { AdminUserUpdate } from '../models/admin-user-update.interface';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly API = `${environment.apiUrl}/admin/users`;
  private http = inject(HttpClient);

  listTeachers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(this.API);
  }

  createTeacher(name: string, email: string): Observable<any> {
    return this.http.post<any>(
      this.API,
      { user: { name, email } },
      { context: new HttpContext().set(SKIP_GLOBAL_ERROR, true) }
    );
  }

  updateTeacher(id: number, data: AdminUserUpdate): Observable<any> {
    return this.http.patch<any>(
      `${this.API}/${id}`,
      data,
      { context: new HttpContext().set(SKIP_GLOBAL_ERROR, true) }
    );
  }

  resendInvitation(id: number): Observable<any> {
    return this.http.post<any>(
      `${this.API}/${id}/resend_invitation`,
      {},
      { context: new HttpContext().set(SKIP_GLOBAL_ERROR, true) }
    );
  }
}
