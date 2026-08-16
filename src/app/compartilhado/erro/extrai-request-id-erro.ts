import { HttpErrorResponse } from '@angular/common/http';

// O backend so ecoa UUID valido (RequestIdFilter nunca repassa o que o
// cliente mandou sem validar) - mas o front nao deveria confiar cegamente
// nisso: um proxy no meio (Caddy) pode devolver outra coisa num erro de
// gateway antes de chegar na app. Validar formato aqui evita exibir pro
// usuario algo que nao e realmente um ID de correlacao.
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function extraiRequestIdErro(error: HttpErrorResponse): string | null {
  const body = error.error;
  const requestId = body && typeof body === 'object' ? body.requestId : undefined;

  if (typeof requestId === 'string' && UUID_REGEX.test(requestId.trim())) {
    return requestId.trim();
  }

  return null;
}
