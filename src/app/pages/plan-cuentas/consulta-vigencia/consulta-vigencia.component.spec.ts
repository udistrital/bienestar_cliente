import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaVigenciaComponent } from './consulta-vigencia.component';

describe('ConsultaVigenciaComponent', () => {
  let component: ConsultaVigenciaComponent;
  let fixture: ComponentFixture<ConsultaVigenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaVigenciaComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaVigenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
