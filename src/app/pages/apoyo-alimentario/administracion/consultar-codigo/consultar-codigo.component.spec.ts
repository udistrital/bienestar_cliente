import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarCodigoComponent } from './consultar-codigo.component';

describe('ConsultarCodigoComponent', () => {
  let component: ConsultarCodigoComponent;
  let fixture: ComponentFixture<ConsultarCodigoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultarCodigoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarCodigoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
