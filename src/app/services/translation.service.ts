import { Injectable, computed } from '@angular/core';
import { LangService, Lang } from './lang.service';

type Translations = Record<Lang, Record<string, string>>;

const TRANSLATIONS: Translations = {
  pt: {
    appTitle: 'Crud UF - Angular/Java',
    askIaLinkLabel: 'Perguntar à IA',
    newStateButton: 'Novo estado',
    siglaHeader: 'Sigla',
    nomeHeader: 'Nome',
    actionsHeader: 'Ações',
  },
  en: {
    appTitle: 'States CRUD - Angular/Java',
    askIaLinkLabel: 'Ask AI',
    newStateButton: 'New state',
    siglaHeader: 'Abbreviation',
    nomeHeader: 'Name',
    actionsHeader: 'Actions',
  },
};

/**
 * Simple translation service that resolves a string based on the current language.
 * It reacts to LangService.lang changes using a computed signal, so any component
 * that reads `t(key)` will automatically update when the language toggles.
 */
@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly langService = inject(LangService);
  private readonly _currentLang = computed(() => this.langService.lang());

  /**
   * Returns the translation for the provided key according to the current language.
   * If the key does not exist for the language, the key itself is returned as a fallback.
   */
  t(key: string): string {
    const lang = this._currentLang();
    const langTranslations = TRANSLATIONS[lang] ?? {};
    return langTranslations[key] ?? key;
  }
}
