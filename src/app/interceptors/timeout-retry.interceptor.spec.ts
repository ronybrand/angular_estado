import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import {
  RETRY_COUNT,
  RETRY_DELAY_MS,
  TIMEOUT_MS,
  timeoutRetryInterceptor,
} from './timeout-retry.interceptor';

describe('timeoutRetryInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    vi.useFakeTimers();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([timeoutRetryInterceptor])),
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

  it('should error out if a request never responds within the configured timeout, even after retries are exhausted', async () => {
    let error: unknown;
    http.get('/api/estado/').subscribe({ error: (err) => (error = err) });

    for (let attempt = 0; attempt <= RETRY_COUNT; attempt++) {
      httpMock.expectOne('/api/estado/');
      await vi.advanceTimersByTimeAsync(TIMEOUT_MS + 1);
      if (attempt < RETRY_COUNT) {
        await vi.advanceTimersByTimeAsync(RETRY_DELAY_MS * 2 ** attempt + 1);
      }
    }

    expect(error).toBeTruthy();
  });

  it('should retry a failed GET request up to RETRY_COUNT times before succeeding', async () => {
    let result: unknown;
    http.get('/api/estado/').subscribe((res) => (result = res));

    for (let attempt = 0; attempt <= RETRY_COUNT; attempt++) {
      const req = httpMock.expectOne('/api/estado/');
      if (attempt < RETRY_COUNT) {
        req.flush('erro', { status: 500, statusText: 'Server Error' });
        await vi.advanceTimersByTimeAsync(RETRY_DELAY_MS * 2 ** attempt);
      } else {
        req.flush([{ id: 1, sigla: 'SP' }]);
      }
    }

    expect(result).toEqual([{ id: 1, sigla: 'SP' }]);
  });

  it('should give up after exhausting all retries on a GET request', async () => {
    let error: unknown;
    http.get('/api/estado/').subscribe({ error: (err) => (error = err) });

    for (let attempt = 0; attempt <= RETRY_COUNT; attempt++) {
      const req = httpMock.expectOne('/api/estado/');
      req.flush('erro', { status: 500, statusText: 'Server Error' });
      if (attempt < RETRY_COUNT) {
        await vi.advanceTimersByTimeAsync(RETRY_DELAY_MS * 2 ** attempt);
      }
    }

    expect(error).toBeTruthy();
  });

  it('should wait longer between each retry attempt (exponential backoff)', async () => {
    let result: unknown;
    http.get('/api/estado/').subscribe((res) => (result = res));

    const first = httpMock.expectOne('/api/estado/');
    first.flush('erro', { status: 500, statusText: 'Server Error' });

    // First retry delay is RETRY_DELAY_MS - not enough time must not
    // trigger it early, and just short of it must still be pending.
    await vi.advanceTimersByTimeAsync(RETRY_DELAY_MS - 1);
    httpMock.expectNone('/api/estado/');
    await vi.advanceTimersByTimeAsync(1);

    const second = httpMock.expectOne('/api/estado/');
    second.flush('erro', { status: 500, statusText: 'Server Error' });

    // Second retry delay doubles to RETRY_DELAY_MS * 2 - waiting only
    // RETRY_DELAY_MS (what the old fixed-delay behavior used) must not
    // be enough to trigger it yet.
    await vi.advanceTimersByTimeAsync(RETRY_DELAY_MS);
    httpMock.expectNone('/api/estado/');
    await vi.advanceTimersByTimeAsync(RETRY_DELAY_MS);

    const third = httpMock.expectOne('/api/estado/');
    third.flush([{ id: 1, sigla: 'SP' }]);

    expect(result).toEqual([{ id: 1, sigla: 'SP' }]);
  });

  it('should not retry a GET request that failed with a 4xx status', async () => {
    let error: unknown;
    http.get('/api/estado/999').subscribe({ error: (err) => (error = err) });

    const req = httpMock.expectOne('/api/estado/999');
    req.flush('erro', { status: 404, statusText: 'Not Found' });

    expect(error).toBeTruthy();
  });

  it('should not retry a failed POST request (non-idempotent)', async () => {
    let error: unknown;
    http.post('/api/estado/', {}).subscribe({ error: (err) => (error = err) });

    const req = httpMock.expectOne('/api/estado/');
    req.flush('erro', { status: 500, statusText: 'Server Error' });
    await vi.advanceTimersByTimeAsync(RETRY_DELAY_MS);

    expect(error).toBeTruthy();
  });
});
