import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluarSolicitudComponent } from './evaluar-solicitud.component';

describe('EvaluarSolicitudComponent', () => {
  let component: EvaluarSolicitudComponent;
  let fixture: ComponentFixture<EvaluarSolicitudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluarSolicitudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluarSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
