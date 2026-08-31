import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { retry, throwError, timeout, timer } from 'rxjs';

export const TIMEOUT_MS = 15000;
export const RETRY_COUNT = 2;
export const RETRY_DELAY_MS = 500;

export const timeoutRetryInterceptor: HttpInterceptorFn = (req, next) => {
  const response$ = next(req).pipe(timeout(TIMEOUT_MS));

  if (req.method !== 'GET') {
    return response$;
  }

  return response$.pipe(
    retry({
      count: RETRY_COUNT,
      delay: (error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status >= 400 && error.status < 500) {
          return throwError(() => error);
        }
        return timer(RETRY_DELAY_MS);
      },
    }),
  );
};
