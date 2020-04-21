import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaEstadoComponent } from './lista-estado.component';

describe('ListaEstadoComponent', () => {
  let component: ListaEstadoComponent;
  let fixture: ComponentFixture<ListaEstadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaEstadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaEstadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
