import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { REQUEST_ID_HEADER, requestIdInterceptor } from './request-id.interceptor';
import { RETRY_COUNT, RETRY_DELAY_MS, timeoutRetryInterceptor } from './timeout-retry.interceptor';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

describe('requestIdInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([requestIdInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should set a valid UUID as the X-Request-Id header', () => {
    http.get('/api/estado/').subscribe();

    const req = httpMock.expectOne('/api/estado/');
    expect(req.request.headers.get(REQUEST_ID_HEADER)).toMatch(UUID_REGEX);
    req.flush([]);
  });

  it('should generate a different id for each independent request', () => {
    http.get('/api/estado/1').subscribe();
    http.get('/api/estado/2').subscribe();

    const [req1, req2] = httpMock.match(() => true);
    expect(req1.request.headers.get(REQUEST_ID_HEADER)).not.toBe(
      req2.request.headers.get(REQUEST_ID_HEADER),
    );
    req1.flush({});
    req2.flush({});
  });
});

describe('requestIdInterceptor + timeoutRetryInterceptor (ordem importa)', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([requestIdInterceptor, timeoutRetryInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    vi.useRealTimers();
  });

  it('should reuse the same requestId across every retry of the same logical GET', async () => {
    let error: unknown;
    http.get('/api/estado/').subscribe({ error: (err) => (error = err) });

    const ids: (string | null)[] = [];
    for (let attempt = 0; attempt <= RETRY_COUNT; attempt++) {
      const req = httpMock.expectOne('/api/estado/');
      ids.push(req.request.headers.get(REQUEST_ID_HEADER));
      req.flush('erro', { status: 500, statusText: 'Server Error' });
      if (attempt < RETRY_COUNT) {
        await vi.advanceTimersByTimeAsync(RETRY_DELAY_MS);
      }
    }

    expect(new Set(ids).size).toBe(1);
    expect(error).toBeTruthy();
  });
});
