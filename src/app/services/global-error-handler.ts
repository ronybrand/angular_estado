import { ErrorHandler, Injectable, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * Captura erros não tratados (exceções em templates, handlers, promises) e
 * expõe um aviso para o usuário. Erros HTTP ficam de fora: já são tratados
 * por tela e pelo authErrorInterceptor.
 */
@Injectable({ providedIn: 'root' })
export class GlobalErrorHandler implements ErrorHandler {
  readonly mensagem = signal<string | null>(null);

  handleError(error: unknown): void {
    console.error(error);
    if (error instanceof HttpErrorResponse) {
      return;
    }
    this.mensagem.set('Ocorreu um erro inesperado. Tente novamente ou recarregue a página.');
  }

  limpar(): void {
    this.mensagem.set(null);
  }
}
