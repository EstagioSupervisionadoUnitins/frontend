import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UsuarioResponse } from '../models/usuario-response.interface';
import { environment } from '../../../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { LoginRequest } from '../models/login-request.interface';
import { SignupRequest } from '../models/signup-request.interface';
import { AuthResponse } from '../models/auth-response.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly API = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'jwt_token';

  private http = inject(HttpClient);
  private router = inject(Router);

  private usuarioSubject = new BehaviorSubject<UsuarioResponse | null>(null);
  public usuario$ = this.usuarioSubject.asObservable();

  constructor() {
    this.carregarSessao();
  }

  login(credenciais: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/login`, credenciais).pipe(
      tap((response) => {
        this.salvarToken(response.token);
        this.decodificarENotificar(response.token, response.username, response.role);
      })
    );
  }

  signup(dados: SignupRequest): Observable<any> {
    return this.http.post(`${this.API}/signup`, dados);
  }

  me(): Observable<UsuarioResponse | null> {
    return this.usuario$;
  }

  logout(redirect: boolean = true): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.usuarioSubject.next(null);
    if (redirect) {
      this.router.navigate(['/login']);
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    return !this.isTokenExpirado(token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  hasRole(role: string): boolean {
    const usuario = this.usuarioSubject.value;
    return usuario?.role === role;
  }

  private salvarToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private carregarSessao() {
    const token = this.getToken();
    if (token && !this.isTokenExpirado(token)) {
      try {
        this.decodificarENotificar(token);
      } catch (error) {
        this.logout(false);
      }
    } else {
      // Apenas limpa o estado, não redireciona forçadamente no construtor
      this.logout(false);
    }
  }

  private isTokenExpirado(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      return Date.now() >= decoded.exp * 1000;
    } catch {
      return true;
    }
  }

  private decodificarENotificar(token: string, username?: string, role?: string) {
    try {
      const decoded: any = jwtDecode(token);
      const usuario: UsuarioResponse = {
        // Prioriza dados passados (login) ou os presentes no novo payload do JWT (refresh)
        username: username || decoded.name || decoded.username || 'Usuário',
        email: decoded.email || '',
        role: (role || decoded.role) as 'student' | 'teacher'
      };
      this.usuarioSubject.next(usuario);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      this.logout(false);
    }
  }
}
