import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, provideRouter } from '@angular/router';
import { Subject, of, throwError } from 'rxjs';

import { CriarEstadoComponent } from './criar-estado.component';
import { EstadoService } from '../../services/estado.service';
import { Estado } from '../../interfaces/estado';

describe('CriarEstadoComponent', () => {
  let component: CriarEstadoComponent;
  let fixture: ComponentFixture<CriarEstadoComponent>;
  let estadoService: { addEstado: ReturnType<typeof vi.fn> };

  const estado: Estado = { id: 1, sigla: 'SP', nome: 'São Paulo' } as Estado;

  beforeEach(async () => {
    estadoService = { addEstado: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [CriarEstadoComponent],
      providers: [provideRouter([]), { provide: EstadoService, useValue: estadoService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CriarEstadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should wrap its content in the same container used by the other pages', () => {
    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.container.mt-3')).toBeTruthy();
  });

  it('should navigate to the estado list after successfully creating an estado', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    estadoService.addEstado.mockReturnValue(of(estado));

    component.addEstado(estado);

    expect(navigateSpy).toHaveBeenCalledWith('/');
  });

  it('should surface the backend error message when creation fails', () => {
    estadoService.addEstado.mockReturnValue(
      throwError(
        () => new HttpErrorResponse({ error: { message: 'Sigla já cadastrada.' }, status: 400 }),
      ),
    );

    component.addEstado(estado);

    expect(component.errorMsgComponent().error()).toBe('Sigla já cadastrada.');
  });

  it('should fall back to a generic message when the backend gives no detail', () => {
    estadoService.addEstado.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 500 })),
    );

    component.addEstado(estado);

    expect(component.errorMsgComponent().error()).toBe('Falha ao adicionar estado.');
  });

  it('should mark salvando while the create request is in flight, guarding against double submission', () => {
    const subject = new Subject<Estado>();
    estadoService.addEstado.mockReturnValue(subject);

    component.addEstado(estado);

    expect(component.salvando()).toBe(true);

    subject.next(estado);

    expect(component.salvando()).toBe(false);
  });

  it('should clear salvando when creation fails', () => {
    estadoService.addEstado.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 500 })),
    );

    component.addEstado(estado);

    expect(component.salvando()).toBe(false);
  });
});
