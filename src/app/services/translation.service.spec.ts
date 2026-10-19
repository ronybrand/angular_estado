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

  it('should fallback to the key when translation is missing', () => {
    expect(translationService.t('nonExistentKey')).toBe('nonExistentKey');
  });
});
