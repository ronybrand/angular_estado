import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

// So anexa X-API-Key em requisicoes para o ai-agent - nunca para
// environment.apiUrl (estado backend), evitando vazar a key do ai-agent
// para a API de estados ou o JWT da API de estados para o ai-agent.
// Boundary-safe check (nao so startsWith), mesmo padrao do authInterceptor.
function ehRequisicaoDoAiAgent(url: string): boolean {
  return url === environment.aiApiUrl || url.startsWith(`${environment.aiApiUrl}/`);
}

export const aiApiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  if (!ehRequisicaoDoAiAgent(req.url)) {
    return next(req);
  }

  return next(req.clone({ setHeaders: { 'X-API-Key': environment.aiApiKey } }));
};
