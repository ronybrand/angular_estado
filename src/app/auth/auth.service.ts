import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { clearToken, getToken } from './token-storage';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresInSeconds: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  login(credenciais: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credenciais);
  }

  // Decodifica o exp do JWT no proprio cliente, sem round-trip ao backend -
  // o token e opaco pra qualquer coisa alem disso (ver ADR 0017 no repo do
  // backend: sem refresh token, expiracao curta e aceitavel).
  isAuthenticated(): boolean {
    const token = getToken();
    if (!token) {
      return false;
    }

    const exp = this.extraiExpiracao(token);
    return exp !== null && exp * 1000 > Date.now();
  }

  logout(): void {
    clearToken();
    this.router.navigateByUrl('/login');
  }

  private extraiExpiracao(token: string): number | null {
    try {
      const payload = token.split('.')[1];
      const decodificado = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      return typeof decodificado.exp === 'number' ? decodificado.exp : null;
    } catch {
      return null;
    }
  }
}
