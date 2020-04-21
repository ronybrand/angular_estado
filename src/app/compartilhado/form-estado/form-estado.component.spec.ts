import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEstadoComponent } from './form-estado.component';

describe('FormEstadoComponent', () => {
  let component: FormEstadoComponent;
  let fixture: ComponentFixture<FormEstadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormEstadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormEstadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
