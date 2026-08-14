import { HttpErrorResponse } from '@angular/common/http';
import { extraiMensagemErro } from './extrai-mensagem-erro';

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
    const error = new HttpErrorResponse({ status: 0 });

    expect(extraiMensagemErro(error, fallback)).toBe(fallback);
  });

  it('should return the fallback when the error body is a plain string (network-level failure)', () => {
    const error = new HttpErrorResponse({ error: 'Failed to fetch', status: 0 });

    expect(extraiMensagemErro(error, fallback)).toBe(fallback);
  });

  it('should return the fallback when the backend message field is not a string', () => {
    const error = new HttpErrorResponse({ error: { message: 500 }, status: 500 });

    expect(extraiMensagemErro(error, fallback)).toBe(fallback);
  });
});
