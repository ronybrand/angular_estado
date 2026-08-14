import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEstadoComponent } from './form-estado.component';

describe('FormEstadoComponent', () => {
  let component: FormEstadoComponent;
  let fixture: ComponentFixture<FormEstadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormEstadoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormEstadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should associate the sigla error message with its input via aria-describedby', () => {
    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    const sigla: HTMLInputElement = compiled.querySelector('#sigla')!;
    expect(sigla.getAttribute('aria-describedby')).toBe('sigla-erro');

    sigla.dispatchEvent(new Event('focus'));
    sigla.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(compiled.querySelector('#sigla-erro')).toBeTruthy();
  });

  it('should associate the nome error message with its input via aria-describedby', () => {
    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    const nome: HTMLInputElement = compiled.querySelector('#nome')!;
    expect(nome.getAttribute('aria-describedby')).toBe('nome-erro');

    nome.dispatchEvent(new Event('focus'));
    nome.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(compiled.querySelector('#nome-erro')).toBeTruthy();
  });

  it('should mark invalid, touched fields with aria-invalid="true"', () => {
    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    const sigla: HTMLInputElement = compiled.querySelector('#sigla')!;

    sigla.dispatchEvent(new Event('focus'));
    sigla.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(sigla.getAttribute('aria-invalid')).toBe('true');
  });

  it('should disable the submit button when desabilitado is true, even with a valid form', () => {
    fixture.componentRef.setInput('estado', { sigla: 'SP', nome: 'São Paulo' });
    fixture.componentRef.setInput('desabilitado', true);
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    const submitButton: HTMLButtonElement = compiled.querySelector('button[type="submit"]')!;

    expect(submitButton.disabled).toBe(true);
  });
});
