import { HttpErrorResponse } from '@angular/common/http';

export function extraiMensagemErro(error: HttpErrorResponse, fallback: string): string {
  const body = error.error;
  const mensagem = body && typeof body === 'object' ? body.message : undefined;

  if (typeof mensagem === 'string' && mensagem.trim().length > 0) {
    return mensagem;
  }

  return fallback;
}
