import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarEstadoComponent } from './criar-estado.component';

describe('CriarEstadoComponent', () => {
  let component: CriarEstadoComponent;
  let fixture: ComponentFixture<CriarEstadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CriarEstadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriarEstadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
