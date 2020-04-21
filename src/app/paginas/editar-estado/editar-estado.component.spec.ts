import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarEstadoComponent } from './editar-estado.component';

describe('EditarEstadoComponent', () => {
  let component: EditarEstadoComponent;
  let fixture: ComponentFixture<EditarEstadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarEstadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarEstadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
