import { TestBed } from '@angular/core/testing';
import { LangService } from './lang.service';

describe('LangService', () => {
  let service: LangService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [LangService],
    });
    service = TestBed.inject(LangService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should initialize with pt by default when localStorage is empty', () => {
    expect(service.lang()).toBe('pt');
  });

  it('should toggle language between pt and en', () => {
    expect(service.lang()).toBe('pt');
    service.toggle();
    expect(service.lang()).toBe('en');
    service.toggle();
    expect(service.lang()).toBe('pt');
  });

  it('should persist language changes to localStorage', () => {
    service.setLang('en');
    expect(service.lang()).toBe('en');
    expect(localStorage.getItem('app_lang')).toBe('en');

    service.toggle();
    expect(service.lang()).toBe('pt');
    expect(localStorage.getItem('app_lang')).toBe('pt');
  });

  it('should load initial language from localStorage if present', () => {
    localStorage.setItem('app_lang', 'en');
    const newService = new LangService();
    expect(newService.lang()).toBe('en');
  });
});
