import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { AiAgentService } from './ai-agent.service';
import { environment } from '../../environments/environment';

describe('AiAgentService', () => {
  let service: AiAgentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AiAgentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('perguntar should POST the question to apiUrl/ask and return the answer', () => {
    service.perguntar('Quantos estados tem o Brasil?').subscribe((result) => {
      expect(result).toEqual({ answer: '27 estados.' });
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/ask`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ question: 'Quantos estados tem o Brasil?' });
    req.flush({ answer: '27 estados.' });
  });
});
