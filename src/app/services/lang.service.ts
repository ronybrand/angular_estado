import { Injectable, signal } from '@angular/core';

export type Lang = 'pt' | 'en';

// Estado de idioma compartilhado entre o header (app.component) e a pagina
// perguntar-ia, que hoje e a unica com conteudo em ingles. Nao e um i18n do
// app inteiro: paginas sem traducao continuam fixas em PT independente
// deste valor.
@Injectable({ providedIn: 'root' })
export class LangService {
  readonly lang = signal<Lang>('pt');

  toggle(): void {
    this.lang.set(this.lang() === 'pt' ? 'en' : 'pt');
  }
}
