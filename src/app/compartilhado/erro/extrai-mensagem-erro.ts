import { HttpErrorResponse } from '@angular/common/http';

export const MENSAGEM_API_INDISPONIVEL =
  'A API está temporariamente fora do ar (pausada para economizar custo). Tente novamente em alguns minutos.';

// Sem resposta HTTP util do backend: rede/DNS (status 0), gateway/origem fora
// (502/503/504 do CloudFront) ou o timeout do interceptor (TimeoutError, que
// nao e HttpErrorResponse). Com a EC2 desligada (deploy/aws-power.ps1 no repo
// do backend) e exatamente isso que o usuario ve.
export function ehApiIndisponivel(error: unknown): boolean {
  if (error instanceof HttpErrorResponse) {
    return (
      error.status === 0 || error.status === 502 || error.status === 503 || error.status === 504
    );
  }
  return error instanceof Error && error.name === 'TimeoutError';
}

// priorizarMensagemBackend default true: o app e PT-only em quase toda
// pagina, entao a mensagem crua do backend (ja em portugues) e a certa.
// A pagina perguntar-ia e a unica com toggle de idioma - passa false
// quando o usuario esta em EN, pra nao vazar a mensagem do backend (sempre
// em PT) por cima da traducao local.
export function extraiMensagemErro(
  error: HttpErrorResponse,
  fallback: string,
  priorizarMensagemBackend = true,
  mensagemApiIndisponivel = MENSAGEM_API_INDISPONIVEL,
): string {
  const body = error.error;
  const mensagem = body && typeof body === 'object' ? body.message : undefined;

  if (priorizarMensagemBackend && typeof mensagem === 'string' && mensagem.trim().length > 0) {
    return mensagem;
  }

  // Depois da mensagem do backend: um 503 com corpo proprio da app continua
  // valendo; a mensagem de "indisponivel" cobre so quando nao ha corpo util.
  return ehApiIndisponivel(error) ? mensagemApiIndisponivel : fallback;
}
