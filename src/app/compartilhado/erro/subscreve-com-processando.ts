import { HttpErrorResponse } from '@angular/common/http';
import { WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { ErrorMsgComponent } from '../error-msg/error-msg.component';
import { ehApiIndisponivel, extraiMensagemErro } from './extrai-mensagem-erro';
import { extraiRequestIdErro } from './extrai-request-id-erro';

// Os 5s padrao do ErrorMsg sao curtos pra este caso: o erro so chega depois de
// timeout + retries (~45s), com a tela vazia, e o aviso sumia antes de ser lido.
export const TEMPO_MENSAGEM_API_INDISPONIVEL_MS = 60000;

export function subscreveComProcessando<T>(
  observable: Observable<T>,
  processando: WritableSignal<boolean>,
  errorMsgComponent: ErrorMsgComponent,
  mensagemErro: string,
  onSuccess: (valor: T) => void,
  priorizarMensagemBackend = true,
  mensagemApiIndisponivel?: string,
): void {
  processando.set(true);
  observable.subscribe({
    next: (valor) => {
      errorMsgComponent.clearError();
      onSuccess(valor);
      processando.set(false);
    },
    error: (error: HttpErrorResponse) => {
      errorMsgComponent.setError(
        extraiMensagemErro(error, mensagemErro, priorizarMensagemBackend, mensagemApiIndisponivel),
        extraiRequestIdErro(error),
        ehApiIndisponivel(error) ? TEMPO_MENSAGEM_API_INDISPONIVEL_MS : undefined,
      );
      processando.set(false);
    },
  });
}
