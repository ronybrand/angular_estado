import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorMsgComponent } from './error-msg.component';

describe('ErrorMsgComponent', () => {
  let component: ErrorMsgComponent;
  let fixture: ComponentFixture<ErrorMsgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorMsgComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should announce the error to assistive technology via role="alert" and aria-live', () => {
    component.setError('Falha ao buscar estado.');
    fixture.detectChanges();

    const alertEl: HTMLElement = fixture.debugElement.nativeElement.querySelector('.alert-danger');
    expect(alertEl.getAttribute('role')).toBe('alert');
    expect(alertEl.getAttribute('aria-live')).toBe('assertive');
  });

  it('should show the requestId when provided', () => {
    component.setError('Falha ao buscar estado.', 'abc-123');
    fixture.detectChanges();

    const el: HTMLElement = fixture.debugElement.nativeElement;
    expect(el.textContent).toContain('abc-123');
  });

  it('should not render a requestId element when none is provided', () => {
    component.setError('Falha ao buscar estado.');
    fixture.detectChanges();

    const el: HTMLElement = fixture.debugElement.nativeElement;
    expect(el.querySelector('small')).toBeNull();
  });
});
