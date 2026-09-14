import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

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

    expect(compiled.querySelector('#sigla-erro')?.textContent?.trim()).toBe(
      'Digite a sigla do estado com 2 letras maiúsculas.',
    );
  });

  it('should show a specific message when sigla duplicates an existing one', () => {
    fixture.componentRef.setInput('siglasExistentes', ['SP', 'RJ']);
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    component.form.controls.sigla.setValue('SP');
    component.form.controls.sigla.markAsTouched();
    fixture.detectChanges();

    expect(compiled.querySelector('#sigla-erro')?.textContent?.trim()).toBe(
      'Já existe um estado cadastrado com essa sigla.',
    );
  });

  it('should not flag siglaDuplicada when the value matches estadoOriginal (editing without changing sigla)', () => {
    fixture.componentRef.setInput('estado', { sigla: 'SP', nome: 'São Paulo' });
    fixture.componentRef.setInput('estadoOriginal', { sigla: 'SP', nome: 'São Paulo' });
    fixture.componentRef.setInput('siglasExistentes', ['SP', 'RJ']);
    fixture.detectChanges();

    expect(component.form.controls.sigla.hasError('siglaDuplicada')).toBe(false);
  });

  it('should uppercase sigla as the user types', () => {
    component.form.controls.sigla.setValue('sp');

    expect(component.form.controls.sigla.value).toBe('SP');
  });

  it('should associate the nome error message with its input via aria-describedby', () => {
    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    const nome: HTMLInputElement = compiled.querySelector('#nome')!;
    expect(nome.getAttribute('aria-describedby')).toBe('nome-erro');

    nome.dispatchEvent(new Event('focus'));
    nome.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(compiled.querySelector('#nome-erro')?.textContent?.trim()).toBe(
      'Digite o nome do estado com pelo menos 3 e no máximo 100 caracteres.',
    );
  });

  it('should mark invalid, touched fields with aria-invalid="true"', () => {
    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    const sigla: HTMLInputElement = compiled.querySelector('#sigla')!;

    sigla.dispatchEvent(new Event('focus'));
    sigla.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(sigla.getAttribute('aria-invalid')).toBe('true');
  });

  it('should enable the submit button and show no errors when sigla and nome are valid without estadoOriginal', () => {
    fixture.componentRef.setInput('estado', { sigla: 'SP', nome: 'São Paulo' });
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    const sigla: HTMLInputElement = compiled.querySelector('#sigla')!;
    const nome: HTMLInputElement = compiled.querySelector('#nome')!;
    sigla.dispatchEvent(new Event('focus'));
    sigla.dispatchEvent(new Event('blur'));
    nome.dispatchEvent(new Event('focus'));
    nome.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    const submitButton: HTMLButtonElement = compiled.querySelector('button[type="submit"]')!;
    expect(submitButton.disabled).toBe(false);
    expect(compiled.querySelector('#sigla-erro')).toBeFalsy();
    expect(compiled.querySelector('#nome-erro')).toBeFalsy();
  });

  it('should disable the submit button when desabilitado is true, even with a valid form', () => {
    fixture.componentRef.setInput('estado', { sigla: 'SP', nome: 'São Paulo' });
    fixture.componentRef.setInput('desabilitado', true);
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    const submitButton: HTMLButtonElement = compiled.querySelector('button[type="submit"]')!;

    expect(submitButton.disabled).toBe(true);
  });

  it('should disable the submit button when the form values match estadoOriginal', () => {
    fixture.componentRef.setInput('estado', { sigla: 'SP', nome: 'São Paulo' });
    fixture.componentRef.setInput('estadoOriginal', { sigla: 'SP', nome: 'São Paulo' });
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    const submitButton: HTMLButtonElement = compiled.querySelector('button[type="submit"]')!;

    expect(submitButton.disabled).toBe(true);
  });

  it('should enable the submit button when the form values differ from estadoOriginal', async () => {
    fixture.componentRef.setInput('estado', { sigla: 'SP', nome: 'São Paulo' });
    fixture.componentRef.setInput('estadoOriginal', { sigla: 'SP', nome: 'São Paulo Antigo' });
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    const submitButton: HTMLButtonElement = compiled.querySelector('button[type="submit"]')!;

    expect(submitButton.disabled).toBe(false);
  });

  it('should enable the submit button when only sigla differs from estadoOriginal', async () => {
    fixture.componentRef.setInput('estado', { sigla: 'RJ', nome: 'São Paulo' });
    fixture.componentRef.setInput('estadoOriginal', { sigla: 'SP', nome: 'São Paulo' });
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    const submitButton: HTMLButtonElement = compiled.querySelector('button[type="submit"]')!;

    expect(submitButton.disabled).toBe(false);
  });

  it('should not emit outputEstado when the form is submitted while invalid', () => {
    const emitSpy = vi.fn();
    component.outputEstado.subscribe(emitSpy);

    component.form.controls.sigla.setValue('S');
    component.form.controls.nome.setValue('AB');
    component.onSubmit();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should mark all fields as touched when submitting an invalid form', () => {
    component.form.controls.sigla.setValue('S');
    component.form.controls.nome.setValue('AB');

    expect(component.form.controls.sigla.touched).toBe(false);

    component.onSubmit();

    expect(component.form.controls.sigla.touched).toBe(true);
    expect(component.form.controls.nome.touched).toBe(true);
  });

  it('should not overwrite in-progress user edits when estado is reassigned with the same values already emitted', () => {
    fixture.componentRef.setInput('estado', { sigla: 'SP', nome: 'São Paulo' });
    fixture.detectChanges();

    component.form.controls.nome.setValue('São Paulo Editado');
    component.form.controls.nome.markAsTouched();

    fixture.componentRef.setInput('estado', { sigla: 'SP', nome: 'São Paulo' });
    fixture.detectChanges();

    expect(component.form.controls.nome.value).toBe('São Paulo Editado');
    expect(component.form.controls.nome.touched).toBe(true);
  });

  it('should still patch the form when estado actually changes to a new value', () => {
    fixture.componentRef.setInput('estado', { sigla: 'SP', nome: 'São Paulo' });
    fixture.detectChanges();

    fixture.componentRef.setInput('estado', { sigla: 'RJ', nome: 'Rio de Janeiro' });
    fixture.detectChanges();

    expect(component.form.controls.sigla.value).toBe('RJ');
    expect(component.form.controls.nome.value).toBe('Rio de Janeiro');
  });

  it('should emit outputEstado preserving fields not present in the form (id, datas)', () => {
    fixture.componentRef.setInput('estado', {
      id: 42,
      sigla: 'SP',
      nome: 'São Paulo',
      dataHoraCadastro: '2024-01-01T00:00:00Z',
      dataHoraUltimaAtualizacao: '2024-01-01T00:00:00Z',
    });
    fixture.detectChanges();

    const emitSpy = vi.fn();
    component.outputEstado.subscribe(emitSpy);

    component.form.controls.nome.setValue('São Paulo Atualizado');
    component.onSubmit();

    expect(emitSpy).toHaveBeenCalledWith({
      id: 42,
      sigla: 'SP',
      nome: 'São Paulo Atualizado',
      dataHoraCadastro: '2024-01-01T00:00:00Z',
      dataHoraUltimaAtualizacao: '2024-01-01T00:00:00Z',
    });
  });
});
