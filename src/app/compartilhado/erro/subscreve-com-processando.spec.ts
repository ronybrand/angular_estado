import { signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { subscreveComProcessando } from './subscreve-com-processando';
import { ErrorMsgComponent } from '../error-msg/error-msg.component';

describe('subscreveComProcessando', () => {
  it('clears a previously set error once the observable succeeds', () => {
    const processando = signal(false);
    const errorMsgComponent = new ErrorMsgComponent();
    errorMsgComponent.setError('Falha ao deletar estado.', 'req-1');

    subscreveComProcessando(
      of(undefined),
      processando,
      errorMsgComponent,
      'Falha.',
      () => undefined,
    );

    expect(errorMsgComponent.error()).toBeNull();
    expect(errorMsgComponent.requestId()).toBeNull();
  });

  it('sets the error message when the observable fails', () => {
    const processando = signal(false);
    const errorMsgComponent = new ErrorMsgComponent();
    const error = new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' });

    subscreveComProcessando(
      throwError(() => error),
      processando,
      errorMsgComponent,
      'Falha ao buscar estado.',
      () => undefined,
    );

    expect(errorMsgComponent.error()).toBe('Falha ao buscar estado.');
  });
});
