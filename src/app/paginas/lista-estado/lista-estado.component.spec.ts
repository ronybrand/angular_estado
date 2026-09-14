import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { Observable, Subject, of, throwError } from 'rxjs';

import { ListaEstadoComponent } from './lista-estado.component';
import { EstadoService } from '../../services/estado.service';
import { Estado } from '../../interfaces/estado';

describe('ListaEstadoComponent', () => {
  const estados: Estado[] = [{ id: 1, sigla: 'SP', nome: 'São Paulo' } as Estado];
  let estadoService: {
    getListaEstados: ReturnType<typeof vi.fn>;
    deletaEstado: ReturnType<typeof vi.fn>;
  };

  async function setup(getListaEstadosReturn: Observable<Estado[]> = of(estados)) {
    estadoService = {
      getListaEstados: vi.fn(() => getListaEstadosReturn),
      deletaEstado: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ListaEstadoComponent],
      providers: [provideRouter([]), { provide: EstadoService, useValue: estadoService }],
    }).compileComponents();

    const fixture: ComponentFixture<ListaEstadoComponent> =
      TestBed.createComponent(ListaEstadoComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return { fixture, component };
  }

  it('should create and load the estado list', async () => {
    const { component } = await setup();

    expect(component).toBeTruthy();
    expect(component.estados()).toEqual(estados);
  });

  it('should label the row action buttons with the estado they act on', async () => {
    const { fixture } = await setup();
    fixture.detectChanges();
    const compiled: HTMLElement = fixture.debugElement.nativeElement;

    const editar: HTMLButtonElement = compiled.querySelector('button.btn-primary')!;
    const excluir: HTMLButtonElement = compiled.querySelector('button.btn-danger')!;

    expect(editar.getAttribute('aria-label')).toBe('Editar SP');
    expect(excluir.getAttribute('aria-label')).toBe('Excluir SP');
  });

  it('should surface the backend error message when loading the list fails', async () => {
    const { component } = await setup(
      throwError(
        () => new HttpErrorResponse({ error: { message: 'Serviço indisponível.' }, status: 503 }),
      ),
    );

    expect(component.errorMsgComponent().error()).toBe('Serviço indisponível.');
  });

  it('should open the confirm dialog instead of deleting immediately', async () => {
    const { component } = await setup();
    const abrirSpy = vi.spyOn(component.confirmDialog(), 'abrir');

    component.deletaEstado(1);

    expect(abrirSpy).toHaveBeenCalled();
    expect(estadoService.deletaEstado).not.toHaveBeenCalled();
  });

  it('should reload the list after confirming and successfully deleting an estado', async () => {
    const { component } = await setup();
    estadoService.deletaEstado.mockReturnValue(of(undefined));
    estadoService.getListaEstados.mockReturnValue(of(estados));

    component.deletaEstado(1);
    component.confirmaExclusao();

    expect(estadoService.deletaEstado).toHaveBeenCalledWith(1);
    expect(estadoService.getListaEstados).toHaveBeenCalledTimes(2);
  });

  it('should surface the backend error message when deletion fails', async () => {
    const { component } = await setup();
    estadoService.deletaEstado.mockReturnValue(
      throwError(
        () => new HttpErrorResponse({ error: { message: 'Estado possui vínculos.' }, status: 409 }),
      ),
    );

    component.deletaEstado(1);
    component.confirmaExclusao();

    expect(component.errorMsgComponent().error()).toBe('Estado possui vínculos.');
  });

  it('should do nothing if confirmaExclusao is called without a pending delete', async () => {
    // Guarda defensiva: confirmar() do dialog so deveria chamar isso depois
    // de deletaEstado() ja ter guardado um id - cobre o caminho em que isso
    // nao aconteceu (idParaExcluir ainda null).
    const { component } = await setup();

    component.confirmaExclusao();

    expect(estadoService.deletaEstado).not.toHaveBeenCalled();
  });

  it('should not delete the estado when the confirmation dialog is cancelled', async () => {
    const { component } = await setup();

    component.deletaEstado(1);
    component.cancelaExclusao();

    expect(estadoService.deletaEstado).not.toHaveBeenCalled();
  });

  it('should disable the exclude buttons while a deletion is in flight, guarding against double clicks', async () => {
    const { component, fixture } = await setup();
    const subject = new Subject<void>();
    estadoService.deletaEstado.mockReturnValue(subject);

    component.deletaEstado(1);
    component.confirmaExclusao();
    fixture.detectChanges();

    expect(component.excluindo()).toBe(true);
    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    const excluir: HTMLButtonElement = compiled.querySelector('button.btn-danger')!;
    expect(excluir.disabled).toBe(true);

    estadoService.getListaEstados.mockReturnValue(of(estados));
    subject.next();
    fixture.detectChanges();

    expect(component.excluindo()).toBe(false);
  });

  it('should re-enable the exclude buttons when deletion fails', async () => {
    const { component } = await setup();
    estadoService.deletaEstado.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 500 })),
    );

    component.deletaEstado(1);
    component.confirmaExclusao();

    expect(component.excluindo()).toBe(false);
  });

  it('should keep the same row DOM node across re-renders identified by estado.id', async () => {
    const { component, fixture } = await setup();
    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    const rowBefore = compiled.querySelector('tbody tr');

    // Mesmo id, objeto com identidade diferente (como viria de um novo GET) -
    // com track por id o Angular deve reutilizar o mesmo nó, não recriar.
    component.estados.set([{ ...estados[0] }]);
    fixture.detectChanges();

    const rowAfter = compiled.querySelector('tbody tr');
    expect(rowAfter).toBe(rowBefore);
  });

  it('should debounce busca input, calling the service once after 300ms with the latest value', async () => {
    vi.useFakeTimers();
    const { component } = await setup();
    estadoService.getListaEstados.mockClear();

    component.onBuscaChange('s');
    component.onBuscaChange('sa');
    component.onBuscaChange('san');
    vi.advanceTimersByTime(299);
    expect(estadoService.getListaEstados).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(estadoService.getListaEstados).toHaveBeenCalledTimes(1);
    expect(estadoService.getListaEstados).toHaveBeenCalledWith('san', undefined);
    vi.useRealTimers();
  });

  it('should clear the pending debounce timer on destroy', async () => {
    vi.useFakeTimers();
    const { component, fixture } = await setup();
    estadoService.getListaEstados.mockClear();

    component.onBuscaChange('sc');
    fixture.destroy();
    vi.advanceTimersByTime(300);

    expect(estadoService.getListaEstados).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('should sort ascending by the clicked field on first click, and toggle to descending on the next click of the same field', async () => {
    const { component } = await setup();
    estadoService.getListaEstados.mockClear();

    component.ordenarPor('nome');
    expect(component.sortCampo()).toBe('nome');
    expect(component.sortDirecao()).toBe('asc');
    expect(estadoService.getListaEstados).toHaveBeenLastCalledWith(undefined, 'nome,asc');

    component.ordenarPor('nome');
    expect(component.sortDirecao()).toBe('desc');
    expect(estadoService.getListaEstados).toHaveBeenLastCalledWith(undefined, 'nome,desc');
  });

  it('should reset direction to ascending when switching the sorted field', async () => {
    const { component } = await setup();

    component.ordenarPor('nome');
    component.ordenarPor('nome');
    expect(component.sortDirecao()).toBe('desc');

    component.ordenarPor('sigla');

    expect(component.sortCampo()).toBe('sigla');
    expect(component.sortDirecao()).toBe('asc');
  });

  it('should show a loading indicator while fetching the list', async () => {
    const subject = new Subject<Estado[]>();
    const { component, fixture } = await setup(subject);

    expect(component.carregando()).toBe(true);
    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('app-spinner')).toBeTruthy();
    expect(compiled.textContent).not.toContain('Nenhum estado cadastrado.');

    subject.next(estados);
    fixture.detectChanges();

    expect(component.carregando()).toBe(false);
    expect(compiled.querySelector('app-spinner')).toBeFalsy();
  });

  it('should render a search input that triggers onBuscaChange on typing', async () => {
    vi.useFakeTimers();
    const { fixture } = await setup();
    estadoService.getListaEstados.mockClear();
    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    const input: HTMLInputElement = compiled.querySelector('#busca-estado')!;

    input.value = 'catarina';
    input.dispatchEvent(new Event('input'));
    vi.advanceTimersByTime(300);

    expect(estadoService.getListaEstados).toHaveBeenCalledWith('catarina', undefined);
    vi.useRealTimers();
  });

  it('should sort by sigla when the Sigla column header is clicked', async () => {
    const { component, fixture } = await setup();
    estadoService.getListaEstados.mockClear();
    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    const botaoSigla: HTMLButtonElement = compiled.querySelector('th button')!;

    botaoSigla.click();

    expect(component.sortCampo()).toBe('sigla');
    expect(estadoService.getListaEstados).toHaveBeenCalledWith(undefined, 'sigla,asc');
  });

  it('should sort by nome when the Nome column header is clicked', async () => {
    const { component, fixture } = await setup();
    estadoService.getListaEstados.mockClear();
    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    const botoes = compiled.querySelectorAll<HTMLButtonElement>('th button');
    const botaoNome = botoes[1];

    botaoNome.click();

    expect(component.sortCampo()).toBe('nome');
    expect(estadoService.getListaEstados).toHaveBeenCalledWith(undefined, 'nome,asc');
  });

  it('should show a sort indicator icon on the active column, switching from ascending to descending on the second click', async () => {
    const { fixture } = await setup();
    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    const [siglaTh, nomeTh] = compiled.querySelectorAll('thead th');
    const botaoSigla: HTMLButtonElement = siglaTh.querySelector('button')!;

    botaoSigla.click();
    fixture.detectChanges();

    expect(siglaTh.querySelector('app-icon')).toBeTruthy();
    expect(nomeTh.querySelector('app-icon')).toBeFalsy();

    botaoSigla.click();
    fixture.detectChanges();

    expect(siglaTh.querySelector('app-icon')).toBeTruthy();
  });

  it('should expose the sort state via aria-sort on the active column header', async () => {
    const { fixture } = await setup();
    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    const [siglaTh, nomeTh] = compiled.querySelectorAll('thead th');
    const botaoSigla: HTMLButtonElement = siglaTh.querySelector('button')!;

    expect(siglaTh.getAttribute('aria-sort')).toBe('none');
    expect(nomeTh.getAttribute('aria-sort')).toBe('none');

    botaoSigla.click();
    fixture.detectChanges();

    expect(siglaTh.getAttribute('aria-sort')).toBe('ascending');
    expect(nomeTh.getAttribute('aria-sort')).toBe('none');

    botaoSigla.click();
    fixture.detectChanges();

    expect(siglaTh.getAttribute('aria-sort')).toBe('descending');
  });

  it('should hide the loading indicator when loading the list fails', async () => {
    const { component } = await setup(
      throwError(
        () => new HttpErrorResponse({ error: { message: 'Serviço indisponível.' }, status: 503 }),
      ),
    );

    expect(component.carregando()).toBe(false);
  });
});
