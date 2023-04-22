import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAtencionesComponent } from './modal-atenciones.component';

describe('ModalAtencionesComponent', () => {
  let component: ModalAtencionesComponent;
  let fixture: ComponentFixture<ModalAtencionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAtencionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAtencionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
