import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { EstadoService } from './estado.service';
import { Estado } from '../interfaces/estado';
import { environment } from '../../environments/environment';

describe('EstadoService', () => {
  let service: EstadoService;
  let httpMock: HttpTestingController;

  const estado: Estado = { id: 1, sigla: 'SP', nome: 'São Paulo' } as Estado;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(EstadoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getListaEstados should GET the list of estados', () => {
    service.getListaEstados().subscribe((result) => {
      expect(result).toEqual([estado]);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/estado/`);
    expect(req.request.method).toBe('GET');
    req.flush([estado]);
  });

  it('getEstado should GET a single estado by id', () => {
    service.getEstado(1).subscribe((result) => {
      expect(result).toEqual(estado);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/estado/1`);
    expect(req.request.method).toBe('GET');
    req.flush(estado);
  });

  it('addEstado should POST the estado', () => {
    service.addEstado(estado).subscribe((result) => {
      expect(result).toEqual(estado);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/estado/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(estado);
    req.flush(estado);
  });

  it('atualizaEstado should PUT the estado', () => {
    service.atualizaEstado(estado).subscribe((result) => {
      expect(result).toEqual(estado);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/estado/`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(estado);
    req.flush(estado);
  });

  it('deletaEstado should DELETE by id and not require a body in the response', () => {
    service.deletaEstado(1).subscribe((result) => {
      expect(result).toBeNull();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/estado/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });
});
