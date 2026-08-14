import { TestBed } from '@angular/core/testing';

import { EstadoService } from './estado.service';

describe('EstadoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EstadoService = TestBed.inject(EstadoService);
    expect(service).toBeTruthy();
  });
});
