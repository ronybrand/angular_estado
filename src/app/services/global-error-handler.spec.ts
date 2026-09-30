import { HttpErrorResponse } from '@angular/common/http';
import { GlobalErrorHandler } from './global-error-handler';

describe('GlobalErrorHandler', () => {
  let handler: GlobalErrorHandler;

  beforeEach(() => {
    handler = new GlobalErrorHandler();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  it('should expose a message for unexpected errors', () => {
    handler.handleError(new Error('boom'));

    expect(handler.mensagem()).toContain('erro inesperado');
  });

  it('should ignore HTTP errors, which are handled elsewhere', () => {
    handler.handleError(new HttpErrorResponse({ status: 500 }));

    expect(handler.mensagem()).toBeNull();
  });

  it('should clear the message', () => {
    handler.handleError(new Error('boom'));
    handler.limpar();

    expect(handler.mensagem()).toBeNull();
  });
});
