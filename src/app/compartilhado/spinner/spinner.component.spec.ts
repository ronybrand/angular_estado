import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerComponent } from './spinner.component';

describe('SpinnerComponent', () => {
  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpinnerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should announce loading to assistive technology via role="status"', () => {
    const statusEl: HTMLElement =
      fixture.debugElement.nativeElement.querySelector('[role="status"]');
    expect(statusEl).not.toBeNull();
  });

  it('should hide the decorative spinner icon from assistive technology', () => {
    const iconEl: HTMLElement = fixture.debugElement.nativeElement.querySelector('.spinner-border');
    expect(iconEl.getAttribute('aria-hidden')).toBe('true');
  });

  it('should expose a text alternative for the loading state', () => {
    const el: HTMLElement = fixture.debugElement.nativeElement;
    expect(el.querySelector('.visually-hidden')?.textContent).toContain('Carregando');
  });
});
