import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { FooterComponent } from './footer.component';
import { InfoService } from '../../services/info.service';
import { FrontendVersion } from '../../interfaces/frontend-version';
import { BackendInfo } from '../../interfaces/backend-info';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let infoService: {
    getFrontendVersion: ReturnType<typeof vi.fn>;
    getBackendInfo: ReturnType<typeof vi.fn>;
  };

  const frontendVersion: FrontendVersion = { commit: 'a1b2c3d', buildDate: '2026-08-18T12:00:00Z' };
  const backendInfo: BackendInfo = {
    build: { time: '2026-08-18T12:00:00Z', commit: 'e4f5g6h' },
  };

  function setup() {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    infoService = { getFrontendVersion: vi.fn(), getBackendInfo: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [{ provide: InfoService, useValue: infoService }],
    }).compileComponents();
  });

  it('should create', () => {
    infoService.getFrontendVersion.mockReturnValue(of(frontendVersion));
    infoService.getBackendInfo.mockReturnValue(of(backendInfo));

    setup();

    expect(component).toBeTruthy();
  });

  it('should show the frontend commit and build date once loaded', () => {
    infoService.getFrontendVersion.mockReturnValue(of(frontendVersion));
    infoService.getBackendInfo.mockReturnValue(of(backendInfo));

    setup();

    const el: HTMLElement = fixture.debugElement.nativeElement;
    expect(el.textContent).toContain('a1b2c3d');
  });

  it('should show the backend commit once loaded', () => {
    infoService.getFrontendVersion.mockReturnValue(of(frontendVersion));
    infoService.getBackendInfo.mockReturnValue(of(backendInfo));

    setup();

    const el: HTMLElement = fixture.debugElement.nativeElement;
    expect(el.textContent).toContain('e4f5g6h');
  });

  it('should show the backend build date once loaded', () => {
    infoService.getFrontendVersion.mockReturnValue(of(frontendVersion));
    infoService.getBackendInfo.mockReturnValue(of(backendInfo));

    setup();

    const el: HTMLElement = fixture.debugElement.nativeElement;
    expect(el.textContent).toMatch(/\d{1,2}\/\d{1,2}\/\d{2,4}/);
  });

  it('should not break when the backend info request fails, keeping the frontend info visible', () => {
    infoService.getFrontendVersion.mockReturnValue(of(frontendVersion));
    infoService.getBackendInfo.mockReturnValue(throwError(() => new Error('offline')));

    setup();

    expect(component.backendInfo()).toBeNull();
    const el: HTMLElement = fixture.debugElement.nativeElement;
    expect(el.textContent).toContain('a1b2c3d');
  });

  it('should not break when the frontend version request fails', () => {
    infoService.getFrontendVersion.mockReturnValue(throwError(() => new Error('not found')));
    infoService.getBackendInfo.mockReturnValue(of(backendInfo));

    setup();

    expect(component.frontendVersion()).toBeNull();
  });
});
