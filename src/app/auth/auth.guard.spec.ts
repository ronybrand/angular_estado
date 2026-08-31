import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('authGuard', () => {
  let authService: { isAuthenticated: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    authService = { isAuthenticated: vi.fn() };
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AuthService, useValue: authService }],
    });
  });

  it('should allow activation when authenticated', () => {
    authService.isAuthenticated.mockReturnValue(true);

    const resultado = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

    expect(resultado).toBe(true);
  });

  it('should redirect to /login when not authenticated', () => {
    authService.isAuthenticated.mockReturnValue(false);
    const router = TestBed.inject(Router);
    const urlTree = router.createUrlTree(['/login']);
    const createUrlTreeSpy = vi.spyOn(router, 'createUrlTree').mockReturnValue(urlTree);

    const resultado = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

    expect(createUrlTreeSpy).toHaveBeenCalledWith(['/login']);
    expect(resultado).toBe(urlTree);
  });
});
