import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { authInterceptor } from './auth.interceptor';
import { environment } from '../../environments/environment';
import { clearToken, setToken } from '../auth/token-storage';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    clearToken();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    clearToken();
  });

  it('should attach the Authorization header when a token is stored', () => {
    setToken('token-armazenado');

    http.get(`${environment.apiUrl}/estado/`).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/estado/`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer token-armazenado');
    req.flush([]);
  });

  it('should not attach the Authorization header when there is no token', () => {
    http.get(`${environment.apiUrl}/estado/`).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/estado/`);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush([]);
  });

  it('should not attach the Authorization header to a request outside the API origin', () => {
    setToken('token-armazenado');

    http.get('https://terceiro.example.com/recurso').subscribe();

    const req = httpMock.expectOne('https://terceiro.example.com/recurso');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush([]);
  });

  it('should not attach the Authorization header to a URL that merely shares the apiUrl prefix', () => {
    setToken('token-armazenado');

    const urlVizinha = `${environment.apiUrl}evil.example.com/recurso`;
    http.get(urlVizinha).subscribe();

    const req = httpMock.expectOne(urlVizinha);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush([]);
  });

  it('should attach the Authorization header to the apiUrl itself with no trailing path', () => {
    setToken('token-armazenado');

    http.get(environment.apiUrl).subscribe();

    const req = httpMock.expectOne(environment.apiUrl);
    expect(req.request.headers.get('Authorization')).toBe('Bearer token-armazenado');
    req.flush([]);
  });
});
