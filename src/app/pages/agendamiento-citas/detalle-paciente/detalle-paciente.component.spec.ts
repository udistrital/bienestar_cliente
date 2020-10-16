import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePacienteComponent } from './detalle-paciente.component';

describe('DetallePacienteComponent', () => {
  let component: DetallePacienteComponent;
  let fixture: ComponentFixture<DetallePacienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetallePacienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallePacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
