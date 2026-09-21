import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { aiApiKeyInterceptor } from './ai-api-key.interceptor';
import { environment } from '../../environments/environment';

describe('aiApiKeyInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([aiApiKeyInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should attach X-API-Key to a request against the ai-agent', () => {
    http.post(`${environment.aiApiUrl}/ask`, {}).subscribe();

    const req = httpMock.expectOne(`${environment.aiApiUrl}/ask`);
    expect(req.request.headers.get('X-API-Key')).toBe(environment.aiApiKey);
    req.flush({});
  });

  it('should attach X-API-Key to the aiApiUrl itself with no trailing path', () => {
    http.get(environment.aiApiUrl).subscribe();

    const req = httpMock.expectOne(environment.aiApiUrl);
    expect(req.request.headers.get('X-API-Key')).toBe(environment.aiApiKey);
    req.flush({});
  });

  it('should not attach X-API-Key to a request against the estado API', () => {
    http.get(`${environment.apiUrl}/estado/`).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/estado/`);
    expect(req.request.headers.has('X-API-Key')).toBe(false);
    req.flush([]);
  });

  it('should not attach X-API-Key to a URL that merely shares the aiApiUrl prefix', () => {
    const urlVizinha = `${environment.aiApiUrl}evil.example.com/recurso`;
    http.get(urlVizinha).subscribe();

    const req = httpMock.expectOne(urlVizinha);
    expect(req.request.headers.has('X-API-Key')).toBe(false);
    req.flush({});
  });
});
