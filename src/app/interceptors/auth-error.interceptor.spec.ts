import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';

import { authErrorInterceptor } from './auth-error.interceptor';
import { getToken, setToken } from '../auth/token-storage';

describe('authErrorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    setToken('token-existente');
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authErrorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should clear the token and redirect to /login on a 401 response', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    let error: unknown;

    http.post('/api/estado/', {}).subscribe({ error: (err) => (error = err) });

    httpMock.expectOne('/api/estado/').flush('erro', { status: 401, statusText: 'Unauthorized' });

    expect(getToken()).toBeNull();
    expect(navigateSpy).toHaveBeenCalledWith('/login');
    expect(error).toBeTruthy();
  });

  it('should leave the token untouched and not redirect on other error statuses', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    let error: unknown;

    http.post('/api/estado/', {}).subscribe({ error: (err) => (error = err) });

    httpMock.expectOne('/api/estado/').flush('erro', { status: 500, statusText: 'Server Error' });

    expect(getToken()).toBe('token-existente');
    expect(navigateSpy).not.toHaveBeenCalled();
    expect(error).toBeTruthy();
  });
});
