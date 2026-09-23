import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';
import { LangService } from './services/lang.service';

@Component({ selector: 'app-dummy-page', template: '' })
class DummyPageComponent {}

const testRoutes: Routes = [
  { path: '', component: DummyPageComponent },
  { path: 'perguntar-ia', component: DummyPageComponent },
  { path: 'outra-pagina', component: DummyPageComponent },
];

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter(testRoutes), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Crud UF - Angular/Java'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Crud UF - Angular/Java');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.navbar-brand').textContent).toContain('Crud UF - Angular/Java');
  });

  it('should render the English title and nav link when the shared language is English on the perguntar-ia page', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/perguntar-ia');
    const langService = TestBed.inject(LangService);
    langService.lang.set('en');

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('.navbar-brand').textContent).toContain(
      'States CRUD - Angular/Java',
    );
    expect(compiled.querySelector('[data-testid="ask-ia-link"]').textContent).toContain('Ask AI');
  });

  it('should reset the shared language to Portuguese when navigating away from perguntar-ia', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/perguntar-ia');
    const langService = TestBed.inject(LangService);
    langService.lang.set('en');

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(langService.lang()).toBe('en');

    await router.navigateByUrl('/outra-pagina');
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(langService.lang()).toBe('pt');
    expect(compiled.querySelector('.navbar-brand').textContent).toContain('Crud UF - Angular/Java');
    expect(compiled.querySelector('[data-testid="ask-ia-link"]').textContent).toContain(
      'Perguntar à IA',
    );
  });

  it('should render the Portuguese nav link by default', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('[data-testid="ask-ia-link"]').textContent).toContain(
      'Perguntar à IA',
    );
  });

  it('should not render an orphan app-error-msg (each page owns its own instance)', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('app-error-msg')).toBeNull();
  });

  it('should not render the logout button when the user is not authenticated', () => {
    const authService = TestBed.inject(AuthService);
    vi.spyOn(authService, 'isAuthenticated').mockReturnValue(false);

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('[data-testid="logout-button"]')).toBeNull();
  });

  it('should render the logout button when the user is authenticated', () => {
    const authService = TestBed.inject(AuthService);
    vi.spyOn(authService, 'isAuthenticated').mockReturnValue(true);

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('[data-testid="logout-button"]')).not.toBeNull();
  });

  it('should call authService.logout() when the logout button is clicked', () => {
    const authService = TestBed.inject(AuthService);
    vi.spyOn(authService, 'isAuthenticated').mockReturnValue(true);
    const logoutSpy = vi.spyOn(authService, 'logout').mockImplementation(() => undefined);

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    const button: HTMLButtonElement = compiled.querySelector('[data-testid="logout-button"]');
    button.click();

    expect(logoutSpy).toHaveBeenCalled();
  });
});
