import { HttpInterceptorFn } from '@angular/common/http';

// Gerado uma vez por ação lógica do usuário, não por tentativa de rede -
// precisa entrar ANTES do timeoutRetryInterceptor no array de
// withInterceptors (main.ts): assim as até RETRY_COUNT tentativas de um
// mesmo GET reenviam o mesmo header, e correlacionam nos logs do backend
// (Grafana/Loki) como uma única ação, não três eventos desconexos.
export const REQUEST_ID_HEADER = 'X-Request-Id';

export const requestIdInterceptor: HttpInterceptorFn = (req, next) => {
  const requestId = crypto.randomUUID();
  return next(req.clone({ setHeaders: { [REQUEST_ID_HEADER]: requestId } }));
};
