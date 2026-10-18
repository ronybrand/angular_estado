import { HttpErrorResponse } from '@angular/common/http';
import {
  ehApiIndisponivel,
  extraiMensagemErro,
  MENSAGEM_API_INDISPONIVEL,
} from './extrai-mensagem-erro';

describe('extraiMensagemErro', () => {
  const fallback = 'Falha ao processar a requisição.';

  it('should return the backend-provided message when present', () => {
    const error = new HttpErrorResponse({
      error: { message: 'Sigla já cadastrada.' },
      status: 400,
    });

    expect(extraiMensagemErro(error, fallback)).toBe('Sigla já cadastrada.');
  });

  it('should return the fallback when the backend message is blank', () => {
    const error = new HttpErrorResponse({ error: { message: '   ' }, status: 400 });

    expect(extraiMensagemErro(error, fallback)).toBe(fallback);
  });

  it('should return the fallback when there is no error body', () => {
    const error = new HttpErrorResponse({ status: 400 });

    expect(extraiMensagemErro(error, fallback)).toBe(fallback);
  });

  it('should return the fallback when the error body is a plain string', () => {
    const error = new HttpErrorResponse({ error: 'Bad request', status: 400 });

    expect(extraiMensagemErro(error, fallback)).toBe(fallback);
  });

  it.each([0, 502, 503, 504])(
    'should return the unavailable message for HTTP status %i',
    (status) => {
      const error = new HttpErrorResponse({ status });

      expect(extraiMensagemErro(error, fallback)).toBe(MENSAGEM_API_INDISPONIVEL);
    },
  );

  it('should keep the backend message on a 503 that carries one', () => {
    const error = new HttpErrorResponse({ error: { message: 'Em manutenção.' }, status: 503 });

    expect(extraiMensagemErro(error, fallback)).toBe('Em manutenção.');
  });

  it('should return the custom unavailable message when provided (EN page)', () => {
    const error = new HttpErrorResponse({ status: 0 });

    expect(extraiMensagemErro(error, fallback, false, 'API offline')).toBe('API offline');
  });

  it('should treat the interceptor TimeoutError as unavailable', () => {
    const timeout = Object.assign(new Error('Timeout has occurred'), { name: 'TimeoutError' });

    expect(ehApiIndisponivel(timeout)).toBe(true);
  });

  it('should not treat a 500 or a generic error as unavailable', () => {
    expect(ehApiIndisponivel(new HttpErrorResponse({ status: 500 }))).toBe(false);
    expect(ehApiIndisponivel(new Error('boom'))).toBe(false);
  });

  it('should return the fallback when the backend message field is not a string', () => {
    const error = new HttpErrorResponse({ error: { message: 500 }, status: 500 });

    expect(extraiMensagemErro(error, fallback)).toBe(fallback);
  });

  it('should return the localized fallback instead of the backend message when priorizarMensagemBackend is false', () => {
    const error = new HttpErrorResponse({
      error: { message: 'Sigla já cadastrada.' },
      status: 400,
    });

    expect(extraiMensagemErro(error, fallback, false)).toBe(fallback);
  });
});
