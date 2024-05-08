import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoSolicitudesComponent } from './dialogo-solicitudes.component';

describe('DialogoSolicitudesComponent', () => {
  let component: DialogoSolicitudesComponent;
  let fixture: ComponentFixture<DialogoSolicitudesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoSolicitudesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoSolicitudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
