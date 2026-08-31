import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, provideRouter } from '@angular/router';
import { Subject, of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../auth/auth.service';
import { getToken } from '../../auth/token-storage';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: { login: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authService = { login: vi.fn() };
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideRouter([]), { provide: AuthService, useValue: authService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should store the token and navigate home after a successful login', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    authService.login.mockReturnValue(of({ token: 'token-emitido', expiresInSeconds: 3600 }));

    component.onSubmit();

    expect(getToken()).toBe('token-emitido');
    expect(navigateSpy).toHaveBeenCalledWith('/');
  });

  it('should surface the backend error message when login fails', () => {
    authService.login.mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({ error: { message: 'Usuario ou senha invalidos' }, status: 401 }),
      ),
    );

    component.onSubmit();

    expect(component.errorMsgComponent().error()).toBe('Usuario ou senha invalidos');
    expect(getToken()).toBeNull();
  });

  it('should mark autenticando while the login request is in flight', () => {
    const subject = new Subject<{ token: string; expiresInSeconds: number }>();
    authService.login.mockReturnValue(subject);

    component.onSubmit();

    expect(component.autenticando()).toBe(true);

    subject.next({ token: 'token-emitido', expiresInSeconds: 3600 });

    expect(component.autenticando()).toBe(false);
  });
});
