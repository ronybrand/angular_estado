import { TestBed } from '@angular/core/testing';
import { TranslatePipe } from './translate.pipe';
import { TranslationService } from '../../services/translation.service';
import { LangService } from '../../services/lang.service';

describe('TranslatePipe', () => {
  let pipe: TranslatePipe;
  let langService: LangService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TranslatePipe, TranslationService, LangService],
    });
    pipe = TestBed.inject(TranslatePipe);
    langService = TestBed.inject(LangService);
  });

  it('should transform a key into translated text', () => {
    expect(pipe.transform('appTitle')).toBe('Crud UF - Angular/Java');

    langService.setLang('en');
    expect(pipe.transform('appTitle')).toBe('States CRUD - Angular/Java');
  });

  it('should pass parameters to translation interpolation', () => {
    expect(pipe.transform('Hello {name}', { name: 'World' })).toBe('Hello World');
  });
});
