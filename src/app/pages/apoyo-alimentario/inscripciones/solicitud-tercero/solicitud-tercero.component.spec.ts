import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudTerceroComponent } from './solicitud-tercero.component';

describe('SolicitudTerceroComponent', () => {
  let component: SolicitudTerceroComponent;
  let fixture: ComponentFixture<SolicitudTerceroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudTerceroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudTerceroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
