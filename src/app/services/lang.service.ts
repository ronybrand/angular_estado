import { Injectable, signal } from '@angular/core';

export type Lang = 'pt' | 'en';

const STORAGE_KEY = 'app_lang';

function getInitialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'pt' || saved === 'en') {
      return saved;
    }
  } catch {
    // Falha de acesso a storage (ex: sandbox) ignora silenciosamente
  }
  return 'pt';
}

@Injectable({ providedIn: 'root' })
export class LangService {
  readonly lang = signal<Lang>(getInitialLang());

  setLang(newLang: Lang): void {
    this.lang.set(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // storage unavailable
    }
  }

  toggle(): void {
    this.setLang(this.lang() === 'pt' ? 'en' : 'pt');
  }
}
