import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaEstudiantesReliquidacionComponent } from './lista-estudiantes-reliquidacion.component';

describe('ListaEstudiantesReliquidacionComponent', () => {
  let component: ListaEstudiantesReliquidacionComponent;
  let fixture: ComponentFixture<ListaEstudiantesReliquidacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaEstudiantesReliquidacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaEstudiantesReliquidacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
