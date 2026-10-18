import { signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { MENSAGEM_API_INDISPONIVEL } from './extrai-mensagem-erro';
import {
  subscreveComProcessando,
  TEMPO_MENSAGEM_API_INDISPONIVEL_MS,
} from './subscreve-com-processando';
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

  describe('when the API is unavailable', () => {
    afterEach(() => vi.useRealTimers());

    function falhaComStatus(status: number) {
      vi.useFakeTimers();
      const errorMsgComponent = new ErrorMsgComponent();
      subscreveComProcessando(
        throwError(() => new HttpErrorResponse({ status })),
        signal(false),
        errorMsgComponent,
        'Falha.',
        () => undefined,
      );
      return errorMsgComponent;
    }

    it('keeps the unavailable message past the default 5s', () => {
      const errorMsgComponent = falhaComStatus(0);

      vi.advanceTimersByTime(TEMPO_MENSAGEM_API_INDISPONIVEL_MS - 1);
      expect(errorMsgComponent.error()).toBe(MENSAGEM_API_INDISPONIVEL);

      vi.advanceTimersByTime(1);
      expect(errorMsgComponent.error()).toBeNull();
    });

    it('flags the error so the turn-on link is offered', () => {
      expect(falhaComStatus(0).apiIndisponivel()).toBe(true);
      expect(falhaComStatus(500).apiIndisponivel()).toBe(false);
    });

    it('keeps the default 5s for an ordinary error', () => {
      const errorMsgComponent = falhaComStatus(500);

      vi.advanceTimersByTime(5000);
      expect(errorMsgComponent.error()).toBeNull();
    });
  });
});
