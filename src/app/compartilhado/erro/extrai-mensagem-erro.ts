import { HttpErrorResponse } from '@angular/common/http';

// priorizarMensagemBackend default true: o app e PT-only em quase toda
// pagina, entao a mensagem crua do backend (ja em portugues) e a certa.
// A pagina perguntar-ia e a unica com toggle de idioma - passa false
// quando o usuario esta em EN, pra nao vazar a mensagem do backend (sempre
// em PT) por cima da traducao local.
export function extraiMensagemErro(
  error: HttpErrorResponse,
  fallback: string,
  priorizarMensagemBackend = true,
): string {
  const body = error.error;
  const mensagem = body && typeof body === 'object' ? body.message : undefined;

  if (priorizarMensagemBackend && typeof mensagem === 'string' && mensagem.trim().length > 0) {
    return mensagem;
  }

  return fallback;
}
