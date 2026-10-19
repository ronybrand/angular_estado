import { TestBed } from '@angular/core/testing';
import { TranslationService } from './translation.service';
import { LangService } from './lang.service';

describe('TranslationService', () => {
  let translationService: TranslationService;
  let langService: LangService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TranslationService, LangService],
    });
    translationService = TestBed.inject(TranslationService);
    langService = TestBed.inject(LangService);
  });

  it('should return Portuguese translation for default language', () => {
    expect(translationService.t('appTitle')).toBe('Crud UF - Angular/Java');
    expect(translationService.t('newStateButton')).toBe('Novo estado');
  });

  it('should return English translation after language toggle', () => {
    langService.lang.set('en');
    expect(translationService.t('appTitle')).toBe('States CRUD - Angular/Java');
    expect(translationService.t('newStateButton')).toBe('New state');
  });

  it('should support new dictionary keys for list, form and navigation', () => {
    expect(translationService.t('statesTitle')).toBe('Estados');
    expect(translationService.t('saveButton')).toBe('Salvar');
    expect(translationService.t('searchPlaceholder')).toBe('Buscar por nome ou sigla...');
    expect(translationService.t('confirmDelete')).toBe(
      'Tem certeza que deseja excluir este estado?',
    );
    expect(translationService.t('editButton')).toBe('Editar');
    expect(translationService.t('deleteButton')).toBe('Excluir');
    expect(translationService.t('cancelButton')).toBe('Cancelar');
    expect(translationService.t('confirmButton')).toBe('Confirmar');
    expect(translationService.t('loginTitle')).toBe('Login');
    expect(translationService.t('enterButton')).toBe('Entrar');

    langService.lang.set('en');
    expect(translationService.t('statesTitle')).toBe('States');
    expect(translationService.t('saveButton')).toBe('Save');
    expect(translationService.t('searchPlaceholder')).toBe('Search by name or abbreviation...');
    expect(translationService.t('confirmDelete')).toBe(
      'Are you sure you want to delete this state?',
    );
    expect(translationService.t('editButton')).toBe('Edit');
    expect(translationService.t('deleteButton')).toBe('Delete');
    expect(translationService.t('cancelButton')).toBe('Cancel');
    expect(translationService.t('confirmButton')).toBe('Confirm');
    expect(translationService.t('loginTitle')).toBe('Login');
    expect(translationService.t('enterButton')).toBe('Log in');
  });

  it('should fallback to the key when translation is missing', () => {
    expect(translationService.t('nonExistentKey')).toBe('nonExistentKey');
  });

  it('should interpolate params into translation or fallback key', () => {
    expect(
      translationService.t('Hello {name}, page {page}', {
        name: 'Angular',
        page: 1,
      }),
    ).toBe('Hello Angular, page 1');
  });

  describe('reactive translation signal: translate()', () => {
    it('should return a reactive Signal that updates automatically when language changes', () => {
      const titleSignal = translationService.translate('appTitle');
      expect(titleSignal()).toBe('Crud UF - Angular/Java');

      langService.lang.set('en');
      expect(titleSignal()).toBe('States CRUD - Angular/Java');
    });

    it('should support params in the reactive Signal', () => {
      const msgSignal = translationService.translate('Welcome {user}', () => ({
        user: 'Dev',
      }));
      expect(msgSignal()).toBe('Welcome Dev');
    });
  });
});
