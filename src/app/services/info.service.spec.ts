import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { InfoService } from './info.service';
import { environment } from '../../environments/environment';
import { BackendInfo } from '../interfaces/backend-info';
import { FrontendVersion } from '../interfaces/frontend-version';

describe('InfoService', () => {
  let service: InfoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(InfoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getFrontendVersion should GET version.json', () => {
    const version: FrontendVersion = { commit: 'a1b2c3d', buildDate: '2026-08-18T12:00:00Z' };

    service.getFrontendVersion().subscribe((result) => {
      expect(result).toEqual(version);
    });

    const req = httpMock.expectOne('/version.json');
    expect(req.request.method).toBe('GET');
    req.flush(version);
  });

  it('getBackendInfo should GET the actuator info endpoint', () => {
    const info: BackendInfo = {
      build: { version: '0.0.1-SNAPSHOT', time: '2026-08-18T12:00:00Z', commit: 'e4f5g6h' },
    };

    service.getBackendInfo().subscribe((result) => {
      expect(result).toEqual(info);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/actuator/info`);
    expect(req.request.method).toBe('GET');
    req.flush(info);
  });
});
