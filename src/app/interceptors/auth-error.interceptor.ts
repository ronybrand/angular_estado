import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { clearToken } from '../auth/token-storage';

// So limpa o token e redireciona - nao trata a mensagem de erro, isso
// continua responsabilidade de subscreveComProcessando/ErrorMsgComponent em
// cada pagina, por isso relanca o erro em vez de engoli-lo.
//
// A propria requisicao de login e excluida: um 401 dela e credencial invalida
// (tratada pelo LoginComponent), nao sessao expirada - nao deve limpar token
// nem redirecionar.
export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const isLoginRequest = req.url === `${environment.apiUrl}/auth/login`;

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && !isLoginRequest) {
        clearToken();
        router.navigateByUrl('/login');
      }
      return throwError(() => error);
    }),
  );
};
