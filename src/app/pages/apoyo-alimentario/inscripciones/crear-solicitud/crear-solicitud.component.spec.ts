import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearSolicitudComponent } from './crear-solicitud.component';

describe('CrearSolicitudComponent', () => {
  let component: CrearSolicitudComponent;
  let fixture: ComponentFixture<CrearSolicitudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearSolicitudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
