import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, provideRouter } from '@angular/router';
import { Observable, Subject, of, throwError } from 'rxjs';

import { EditarEstadoComponent } from './editar-estado.component';
import { EstadoService } from 'src/app/services/estado.service';
import { Estado } from 'src/app/interfaces/estado';

describe('EditarEstadoComponent', () => {
  const estado: Estado = { id: 1, sigla: 'SP', nome: 'São Paulo' } as Estado;
  let estadoService: {
    getEstado: ReturnType<typeof vi.fn>;
    atualizaEstado: ReturnType<typeof vi.fn>;
  };

  async function setup(getEstadoReturn: Observable<Estado> = of(estado)) {
    estadoService = {
      getEstado: vi.fn(() => getEstadoReturn),
      atualizaEstado: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [EditarEstadoComponent],
      providers: [provideRouter([]), { provide: EstadoService, useValue: estadoService }],
    }).compileComponents();

    const fixture: ComponentFixture<EditarEstadoComponent> =
      TestBed.createComponent(EditarEstadoComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return { fixture, component };
  }

  it('should create and load the estado', async () => {
    const { component } = await setup();

    expect(component).toBeTruthy();
    expect(component.estado).toEqual(estado);
  });

  it('should surface the backend error message when loading the estado fails', async () => {
    const { component } = await setup(
      throwError(
        () => new HttpErrorResponse({ error: { message: 'Estado não encontrado.' }, status: 404 }),
      ),
    );

    expect(component.errorMsgComponent().error).toBe('Estado não encontrado.');
  });

  it('should navigate to the estado list after successfully updating', async () => {
    const { component } = await setup();
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    estadoService.atualizaEstado.mockReturnValue(of(estado));

    component.atualizaEstado(estado);

    expect(navigateSpy).toHaveBeenCalledWith('/');
  });

  it('should surface the backend error message when updating fails', async () => {
    const { component } = await setup();
    estadoService.atualizaEstado.mockReturnValue(
      throwError(
        () => new HttpErrorResponse({ error: { message: 'Nome inválido.' }, status: 400 }),
      ),
    );

    component.atualizaEstado(estado);

    expect(component.errorMsgComponent().error).toBe('Nome inválido.');
  });

  it('should show a loading indicator while fetching the estado', async () => {
    const subject = new Subject<Estado>();
    const { component, fixture } = await setup(subject);

    expect(component.carregando).toBe(true);
    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('app-spinner')).toBeTruthy();

    subject.next(estado);
    fixture.detectChanges();

    expect(component.carregando).toBe(false);
    expect(compiled.querySelector('app-spinner')).toBeFalsy();
  });

  it('should hide the loading indicator when loading the estado fails', async () => {
    const { component } = await setup(
      throwError(
        () => new HttpErrorResponse({ error: { message: 'Estado não encontrado.' }, status: 404 }),
      ),
    );

    expect(component.carregando).toBe(false);
  });
});
