import { HttpInterceptorFn } from '@angular/common/http';
import { getToken } from '../auth/token-storage';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = getToken();
  if (!token) {
    return next(req);
  }

  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
