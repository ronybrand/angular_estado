import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { Observable, Subject, of, throwError } from 'rxjs';

import { ListaEstadoComponent } from './lista-estado.component';
import { EstadoService } from 'src/app/services/estado.service';
import { Estado } from 'src/app/interfaces/estado';

describe('ListaEstadoComponent', () => {
  const estados: Estado[] = [{ id: 1, sigla: 'SP', nome: 'São Paulo' } as Estado];
  let estadoService: {
    getListaEstados: ReturnType<typeof vi.fn>;
    deletaEstado: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
  });

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
    expect(component.estados).toEqual(estados);
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

    expect(component.errorMsgComponent().error).toBe('Serviço indisponível.');
  });

  it('should reload the list after successfully deleting an estado', async () => {
    const { component } = await setup();
    estadoService.deletaEstado.mockReturnValue(of(undefined));
    estadoService.getListaEstados.mockReturnValue(of(estados));

    component.deletaEstado(1);

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

    expect(component.errorMsgComponent().error).toBe('Estado possui vínculos.');
  });

  it('should ask for confirmation before deleting an estado', async () => {
    const { component } = await setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    estadoService.deletaEstado.mockReturnValue(of(undefined));

    component.deletaEstado(1);

    expect(confirmSpy).toHaveBeenCalled();
    expect(estadoService.deletaEstado).toHaveBeenCalledWith(1);
  });

  it('should not delete the estado when the confirmation is cancelled', async () => {
    const { component } = await setup();
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    component.deletaEstado(1);

    expect(estadoService.deletaEstado).not.toHaveBeenCalled();
  });

  it('should show a loading indicator while fetching the list', async () => {
    const subject = new Subject<Estado[]>();
    const { component, fixture } = await setup(subject);

    expect(component.carregando).toBe(true);
    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('app-spinner')).toBeTruthy();
    expect(compiled.textContent).not.toContain('Nenhum estado cadastrado.');

    subject.next(estados);
    fixture.detectChanges();

    expect(component.carregando).toBe(false);
    expect(compiled.querySelector('app-spinner')).toBeFalsy();
  });

  it('should hide the loading indicator when loading the list fails', async () => {
    const { component } = await setup(
      throwError(
        () => new HttpErrorResponse({ error: { message: 'Serviço indisponível.' }, status: 503 }),
      ),
    );

    expect(component.carregando).toBe(false);
  });
});
