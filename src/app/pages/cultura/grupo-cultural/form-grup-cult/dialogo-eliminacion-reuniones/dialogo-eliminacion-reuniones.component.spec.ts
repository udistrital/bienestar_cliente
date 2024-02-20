import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoEliminacionReunionesComponent } from './dialogo-eliminacion-reuniones.component';

describe('DialogoEliminacionReunionesComponent', () => {
  let component: DialogoEliminacionReunionesComponent;
  let fixture: ComponentFixture<DialogoEliminacionReunionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoEliminacionReunionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoEliminacionReunionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
