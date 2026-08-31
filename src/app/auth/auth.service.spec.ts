import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';

import { AuthService } from './auth.service';
import { clearToken, getToken, setToken } from './token-storage';
import { environment } from '../../environments/environment';

function tokenComExpiracao(exp: number): string {
  const payload = btoa(JSON.stringify({ exp })).replace(/\+/g, '-').replace(/\//g, '_');
  return `cabecalho.${payload}.assinatura`;
}

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    clearToken();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    clearToken();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('login should POST credentials and return the token response', () => {
    service.login({ username: 'admin', password: 'senha' }).subscribe((result) => {
      expect(result).toEqual({ token: 'token-emitido', expiresInSeconds: 3600 });
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'admin', password: 'senha' });
    req.flush({ token: 'token-emitido', expiresInSeconds: 3600 });
  });

  it('isAuthenticated should be false when there is no token', () => {
    expect(service.isAuthenticated()).toBe(false);
  });

  it('isAuthenticated should be true for a token whose exp is in the future', () => {
    setToken(tokenComExpiracao(Math.floor(Date.now() / 1000) + 3600));

    expect(service.isAuthenticated()).toBe(true);
  });

  it('isAuthenticated should be false for an expired token', () => {
    setToken(tokenComExpiracao(Math.floor(Date.now() / 1000) - 3600));

    expect(service.isAuthenticated()).toBe(false);
  });

  it('isAuthenticated should be false for a malformed token', () => {
    setToken('nao-e-um-jwt-valido');

    expect(service.isAuthenticated()).toBe(false);
  });

  it('logout should clear the token and navigate to /login', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    setToken(tokenComExpiracao(Math.floor(Date.now() / 1000) + 3600));

    service.logout();

    expect(getToken()).toBeNull();
    expect(navigateSpy).toHaveBeenCalledWith('/login');
  });
});
