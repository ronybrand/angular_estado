import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { authInterceptor } from './auth.interceptor';
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

    http.get('/api/estado/').subscribe();

    const req = httpMock.expectOne('/api/estado/');
    expect(req.request.headers.get('Authorization')).toBe('Bearer token-armazenado');
    req.flush([]);
  });

  it('should not attach the Authorization header when there is no token', () => {
    http.get('/api/estado/').subscribe();

    const req = httpMock.expectOne('/api/estado/');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush([]);
  });
});
