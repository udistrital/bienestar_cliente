import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudiantePeriodoComponent } from './estudiante-periodo.component';

describe('EstudiantePeriodoComponent', () => {
  let component: EstudiantePeriodoComponent;
  let fixture: ComponentFixture<EstudiantePeriodoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstudiantePeriodoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstudiantePeriodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
