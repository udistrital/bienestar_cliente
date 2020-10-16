import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleHorarioComponent } from './detalle-horario.component';

describe('DetalleHorarioComponent', () => {
  let component: DetalleHorarioComponent;
  let fixture: ComponentFixture<DetalleHorarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleHorarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleHorarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
