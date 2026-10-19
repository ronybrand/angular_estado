import { Injectable, Signal, computed, inject } from '@angular/core';
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

export type TranslationKey = keyof (typeof TRANSLATIONS)['pt'];

/**
 * Simple translation service that resolves a string based on the current language.
 * Offers both snapshot translation `t()` and a fully reactive Signal `translate()`.
 */
@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly langService = inject(LangService);
  private readonly _currentLang = computed(() => this.langService.lang());

  /**
   * Returns the translation for the provided key according to the current language.
   * If the key does not exist for the language, the key itself is returned as a fallback.
   * Supports optional interpolation parameters, e.g. `{name}` in translations.
   */
  t(key: TranslationKey | (string & {}), params?: Record<string, string | number>): string {
    const lang = this._currentLang();
    const langTranslations = TRANSLATIONS[lang];
    let translation = langTranslations[key] ?? key;

    if (params) {
      for (const [paramKey, value] of Object.entries(params)) {
        translation = translation.replaceAll(`{${paramKey}}`, String(value));
      }
    }

    return translation;
  }

  /**
   * Returns a reactive `Signal<string>` that automatically re-evaluates whenever
   * the active language changes, ideal for OnPush templates and computed state.
   */
  translate(
    key: TranslationKey | (string & {}),
    params?: Record<string, string | number> | (() => Record<string, string | number>),
  ): Signal<string> {
    return computed(() => {
      const resolvedParams = typeof params === 'function' ? params() : params;
      return this.t(key, resolvedParams);
    });
  }
}
