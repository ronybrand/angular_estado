import { HttpErrorResponse } from '@angular/common/http';
import { WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { ErrorMsgComponent } from '../error-msg/error-msg.component';
import { extraiMensagemErro } from './extrai-mensagem-erro';

export function subscreveComCarregamento<T>(
  observable: Observable<T>,
  carregando: WritableSignal<boolean>,
  errorMsgComponent: ErrorMsgComponent,
  mensagemErro: string,
  onSuccess: (valor: T) => void,
): void {
  carregando.set(true);
  observable.subscribe({
    next: (valor) => {
      onSuccess(valor);
      carregando.set(false);
    },
    error: (error: HttpErrorResponse) => {
      errorMsgComponent.setError(extraiMensagemErro(error, mensagemErro));
      carregando.set(false);
    },
  });
}
