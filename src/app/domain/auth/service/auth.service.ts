import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { UsuarioResponse } from '../models/usuario-response.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  // adaptar para o futuro backend, quando tiver login e token

  private readonly API = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'jwt_token';

  private http = inject(HttpClient);
  private router = inject(Router);

  private usuarioSubject = new BehaviorSubject<UsuarioResponse | null>(null);
  
  public usuario$ = this.usuarioSubject.asObservable();
  
  
  // aqui vai retornar token, com o token setar no logal storage
  login(email: string, senha: string): Observable<any> {
    const usuarioMockado: UsuarioResponse = {
      id: 1,
      nome: 'Matheus Mockado',
      email: 'matheus.mockado@example.com',
      perfil: {
        id: 1,
        label: 'Aluno',
      },
    }

    this.usuarioSubject.next(usuarioMockado);
    return new Observable((observer) => {
      observer.next(usuarioMockado);
      observer.complete();
    });
  }

  me(): Observable<UsuarioResponse> {
    const usuarioMockado: UsuarioResponse = {
      id: 1,
      nome: 'Matheus Mockado',
      email: 'matheus.mockado@example.com',
      perfil: {
        id: 1,
        label: 'Aluno',
      },
    }

    this.usuarioSubject.next(usuarioMockado);
    return new Observable((observer) => {
      observer.next(usuarioMockado);
      observer.complete();
    });
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.usuarioSubject.next(null);
    this.router.navigate(['/login']);
  }
}
