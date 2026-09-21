import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { retry, throwError, timeout, timer } from 'rxjs';
import { ehRequisicaoDoAiAgent } from '../compartilhado/http/eh-requisicao-do-ai-agent';

export const TIMEOUT_MS = 15000;
// O ai-agent chama o Gemini com tool-calling, que pode legitimamente
// demorar bem mais que o CRUD simples de estados - 15s bastam para o
// resto da API, mas cortariam uma resposta de IA em andamento.
export const AI_AGENT_TIMEOUT_MS = 60000;
export const RETRY_COUNT = 2;
export const RETRY_DELAY_MS = 500;

export const timeoutRetryInterceptor: HttpInterceptorFn = (req, next) => {
  const timeoutMs = ehRequisicaoDoAiAgent(req.url) ? AI_AGENT_TIMEOUT_MS : TIMEOUT_MS;
  const response$ = next(req).pipe(timeout(timeoutMs));

  if (req.method !== 'GET') {
    return response$;
  }

  return response$.pipe(
    retry({
      count: RETRY_COUNT,
      delay: (error: unknown, retryCount: number) => {
        if (error instanceof HttpErrorResponse && error.status >= 400 && error.status < 500) {
          return throwError(() => error);
        }
        return timer(RETRY_DELAY_MS * 2 ** (retryCount - 1));
      },
    }),
  );
};
