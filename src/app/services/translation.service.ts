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
    createdHeader: 'Criado',
    updatedHeader: 'Última Alteração',
    actionsHeader: 'Ações',
    statesTitle: 'Estados',
    saveButton: 'Salvar',
    savingButton: 'Salvando...',
    searchPlaceholder: 'Buscar por nome ou sigla...',
    noStates: 'Nenhum estado cadastrado.',
    createFirstState: 'Criar o primeiro estado',
    editButton: 'Editar',
    deleteButton: 'Excluir',
    cancelButton: 'Cancelar',
    confirmButton: 'Confirmar',
    confirmDelete: 'Tem certeza que deseja excluir este estado?',
    loginTitle: 'Login',
    userLabel: 'Usuário',
    passwordLabel: 'Senha',
    enterButton: 'Entrar',
    authenticatingButton: 'Entrando...',
    createTitle: 'Criar',
    editTitle: 'Editar',
    demoCredentialsNote: 'Credenciais de demo (intencionalmente públicas):',
    siglaDuplicateError: 'Já existe um estado cadastrado com essa sigla.',
    siglaFormatError: 'Digite a sigla do estado com 2 letras maiúsculas.',
    nomeFormatError: 'Digite o nome do estado com pelo menos 3 e no máximo 100 caracteres.',
    userRequiredError: 'Digite o usuário.',
    passwordRequiredError: 'Digite a senha.',
    invalidCredentialsError: 'Usuário ou senha inválidos.',
    loadStatesError: 'Falha ao buscar estados.',
    loadStateError: 'Falha ao buscar estado.',
    addStateError: 'Falha ao adicionar estado.',
    updateStateError: 'Falha ao atualizar estado.',
    deleteStateError: 'Falha ao deletar estado.',
  },
  en: {
    appTitle: 'States CRUD - Angular/Java',
    askIaLinkLabel: 'Ask AI',
    newStateButton: 'New state',
    siglaHeader: 'Abbreviation',
    nomeHeader: 'Name',
    createdHeader: 'Created',
    updatedHeader: 'Last Updated',
    actionsHeader: 'Actions',
    statesTitle: 'States',
    saveButton: 'Save',
    savingButton: 'Saving...',
    searchPlaceholder: 'Search by name or abbreviation...',
    noStates: 'No registered states.',
    createFirstState: 'Create the first state',
    editButton: 'Edit',
    deleteButton: 'Delete',
    cancelButton: 'Cancel',
    confirmButton: 'Confirm',
    confirmDelete: 'Are you sure you want to delete this state?',
    loginTitle: 'Login',
    userLabel: 'Username',
    passwordLabel: 'Password',
    enterButton: 'Log in',
    authenticatingButton: 'Logging in...',
    createTitle: 'Create',
    editTitle: 'Edit',
    demoCredentialsNote: 'Demo credentials (intentionally public):',
    siglaDuplicateError: 'A state with this abbreviation already exists.',
    siglaFormatError: 'Enter the state abbreviation with 2 uppercase letters.',
    nomeFormatError: 'Enter the state name with at least 3 and at most 100 characters.',
    userRequiredError: 'Enter the username.',
    passwordRequiredError: 'Enter the password.',
    invalidCredentialsError: 'Invalid username or password.',
    loadStatesError: 'Failed to fetch states.',
    loadStateError: 'Failed to fetch state.',
    addStateError: 'Failed to add state.',
    updateStateError: 'Failed to update state.',
    deleteStateError: 'Failed to delete state.',
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
