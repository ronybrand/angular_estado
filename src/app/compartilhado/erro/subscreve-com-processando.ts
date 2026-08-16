import { HttpErrorResponse } from '@angular/common/http';
import { WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { ErrorMsgComponent } from '../error-msg/error-msg.component';
import { extraiMensagemErro } from './extrai-mensagem-erro';
import { extraiRequestIdErro } from './extrai-request-id-erro';

export function subscreveComProcessando<T>(
  observable: Observable<T>,
  processando: WritableSignal<boolean>,
  errorMsgComponent: ErrorMsgComponent,
  mensagemErro: string,
  onSuccess: (valor: T) => void,
): void {
  processando.set(true);
  observable.subscribe({
    next: (valor) => {
      onSuccess(valor);
      processando.set(false);
    },
    error: (error: HttpErrorResponse) => {
      errorMsgComponent.setError(
        extraiMensagemErro(error, mensagemErro),
        extraiRequestIdErro(error),
      );
      processando.set(false);
    },
  });
}
