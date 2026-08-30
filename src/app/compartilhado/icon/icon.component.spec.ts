import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconComponent } from './icon.component';
import { ICON_PATHS } from './icon-paths';

describe('IconComponent', () => {
  let fixture: ComponentFixture<IconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconComponent);
    fixture.componentRef.setInput('name', 'trash');
    fixture.detectChanges();
  });

  it('should render the path for the requested icon name', () => {
    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    const path = compiled.querySelector('path')!;

    expect(path.getAttribute('d')).toBe(ICON_PATHS['trash']);
  });

  it('should default to a 16px size and be hidden from assistive tech', () => {
    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    const svg = compiled.querySelector('svg')!;

    expect(svg.getAttribute('width')).toBe('16');
    expect(svg.getAttribute('height')).toBe('16');
    expect(svg.getAttribute('aria-hidden')).toBe('true');
  });

  it('should apply a custom size when provided', () => {
    fixture.componentRef.setInput('size', 14);
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    const svg = compiled.querySelector('svg')!;

    expect(svg.getAttribute('width')).toBe('14');
    expect(svg.getAttribute('height')).toBe('14');
  });
});
