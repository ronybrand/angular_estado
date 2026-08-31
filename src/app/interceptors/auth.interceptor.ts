import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { getToken } from '../auth/token-storage';

// So anexa o header de auth em requisicoes para a propria API - evita
// vazar o JWT para uma origem de terceiros caso alguma requisicao no futuro
// aponte para fora de environment.apiUrl.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = getToken();
  if (!token || !req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
