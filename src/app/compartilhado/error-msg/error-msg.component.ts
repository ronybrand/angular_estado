import { Component, computed, input, signal } from '@angular/core';
import { urlLigarApi } from '../erro/extrai-mensagem-erro';

@Component({
  selector: 'app-error-msg',
  templateUrl: './error-msg.component.html',
  styleUrls: ['./error-msg.component.scss'],
})
export class ErrorMsgComponent {
  public error = signal<string | null>(null);
  public requestId = signal<string | null>(null);
  public apiIndisponivel = signal(false);
  readonly idioma = input<'pt' | 'en'>('pt');
  readonly urlLigarApi = computed(() => urlLigarApi(window.location.href, this.idioma()));
  readonly textoLigarApi = computed(() =>
    this.idioma() === 'en' ? 'Turn on the API' : 'Ligar a API',
  );
  private limpezaTimeoutId: ReturnType<typeof setTimeout> | undefined;

  setError(error: string, requestId: string | null = null, tempo = 5000, apiIndisponivel = false) {
    clearTimeout(this.limpezaTimeoutId);

    this.error.set(error);
    this.requestId.set(requestId);
    this.apiIndisponivel.set(apiIndisponivel);
    this.limpezaTimeoutId = setTimeout(() => {
      this.error.set(null);
      this.requestId.set(null);
      this.apiIndisponivel.set(false);
    }, tempo);
  }

  clearError() {
    clearTimeout(this.limpezaTimeoutId);
    this.error.set(null);
    this.requestId.set(null);
    this.apiIndisponivel.set(false);
  }
}
