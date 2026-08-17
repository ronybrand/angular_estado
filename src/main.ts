import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { requestIdInterceptor } from './app/interceptors/request-id.interceptor';
import { timeoutRetryInterceptor } from './app/interceptors/timeout-retry.interceptor';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    // requestIdInterceptor precisa vir ANTES do timeoutRetryInterceptor:
    // gera o id uma vez por ação do usuário, não uma vez por tentativa de
    // rede - se a ordem for invertida, cada retry ganha um id novo e perde
    // a correlação no backend.
    provideHttpClient(withInterceptors([requestIdInterceptor, timeoutRetryInterceptor])),
  ],
}).catch((err) => console.error(err));
