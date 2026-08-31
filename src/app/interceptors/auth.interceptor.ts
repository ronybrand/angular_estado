import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { getToken } from '../auth/token-storage';

// So anexa o header de auth em requisicoes para a propria API - evita
// vazar o JWT para uma origem de terceiros caso alguma requisicao no futuro
// aponte para fora de environment.apiUrl. Compara com boundary (nao so
// startsWith) para uma URL vizinha tipo apiUrl+"evil.com" nao ser tratada
// como se fosse a propria API.
function ehRequisicaoDaApi(url: string): boolean {
  return url === environment.apiUrl || url.startsWith(`${environment.apiUrl}/`);
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = getToken();
  if (!token || !ehRequisicaoDaApi(req.url)) {
    return next(req);
  }

  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
