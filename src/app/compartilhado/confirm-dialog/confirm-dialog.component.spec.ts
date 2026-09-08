import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  async function setup(mensagem = 'Tem certeza que deseja excluir este estado?') {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
    }).compileComponents();

    const fixture: ComponentFixture<ConfirmDialogComponent> =
      TestBed.createComponent(ConfirmDialogComponent);
    fixture.componentRef.setInput('mensagem', mensagem);
    fixture.detectChanges();
    return { fixture, component: fixture.componentInstance };
  }

  function getDialog(fixture: ComponentFixture<ConfirmDialogComponent>): HTMLDialogElement {
    return fixture.nativeElement.querySelector('dialog');
  }

  it('renders the given message', async () => {
    const { fixture } = await setup('Excluir SP?');

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Excluir SP?');
  });

  it('starts closed', async () => {
    const { fixture } = await setup();

    expect(getDialog(fixture).open).toBe(false);
  });

  it('abrir() opens the dialog as a modal', async () => {
    const { fixture, component } = await setup();

    component.abrir();
    fixture.detectChanges();

    expect(getDialog(fixture).open).toBe(true);
  });

  it('emits confirmar and closes the dialog when the confirm button is clicked', async () => {
    const { fixture, component } = await setup();
    component.abrir();
    fixture.detectChanges();
    let emitted = false;
    component.confirmar.subscribe(() => (emitted = true));

    const botaoConfirmar: HTMLButtonElement =
      fixture.nativeElement.querySelector('button.btn-danger');
    botaoConfirmar.click();
    fixture.detectChanges();

    expect(emitted).toBe(true);
    expect(getDialog(fixture).open).toBe(false);
  });

  it('emits cancelar and closes the dialog when the cancel button is clicked', async () => {
    const { fixture, component } = await setup();
    component.abrir();
    fixture.detectChanges();
    let emitted = false;
    component.cancelar.subscribe(() => (emitted = true));

    const botaoCancelar: HTMLButtonElement =
      fixture.nativeElement.querySelector('button.btn-secondary');
    botaoCancelar.click();
    fixture.detectChanges();

    expect(emitted).toBe(true);
    expect(getDialog(fixture).open).toBe(false);
  });

  it('emits cancelar when the dialog is dismissed via the native cancel event (Escape)', async () => {
    const { fixture, component } = await setup();
    component.abrir();
    fixture.detectChanges();
    let emitted = false;
    component.cancelar.subscribe(() => (emitted = true));

    getDialog(fixture).dispatchEvent(new Event('cancel'));

    expect(emitted).toBe(true);
  });
});
