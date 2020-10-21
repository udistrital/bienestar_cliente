import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaCitaEstudianteComponent } from './agenda-cita-estudiante.component';

describe('AgendaCitaEstudianteComponent', () => {
  let component: AgendaCitaEstudianteComponent;
  let fixture: ComponentFixture<AgendaCitaEstudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgendaCitaEstudianteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaCitaEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
