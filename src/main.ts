import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { requestIdInterceptor } from './app/interceptors/request-id.interceptor';
import { timeoutRetryInterceptor } from './app/interceptors/timeout-retry.interceptor';
import { authInterceptor } from './app/interceptors/auth.interceptor';
import { authErrorInterceptor } from './app/interceptors/auth-error.interceptor';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

// UI is entirely in pt-BR (see index.html's lang="pt-BR") - dates formatted by
// DatePipe should follow suit instead of Angular's en-US default.
registerLocaleData(localePt, 'pt-BR');

bootstrapApplication(AppComponent, {
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    provideRouter(routes, withComponentInputBinding()),
    // requestIdInterceptor precisa vir ANTES do timeoutRetryInterceptor:
    // gera o id uma vez por ação do usuário, não uma vez por tentativa de
    // rede - se a ordem for invertida, cada retry ganha um id novo e perde
    // a correlação no backend. authInterceptor anexa o header de auth antes
    // da requisição sair; authErrorInterceptor trata 401 na volta,
    // independente de quantas tentativas o retry fizer.
    // authInterceptor também precisa vir ANTES de authErrorInterceptor: como
    // os interceptors funcionais formam uma cadeia, o handler de erro só
    // "vê" a resposta depois que ela passa de volta por quem vier depois
    // dele na lista - se authErrorInterceptor for movido para antes de
    // authInterceptor, essa garantia de ordem se perde silenciosamente.
    provideHttpClient(
      withInterceptors([
        requestIdInterceptor,
        authInterceptor,
        authErrorInterceptor,
        timeoutRetryInterceptor,
      ]),
    ),
  ],
}).catch((err) => console.error(err));
