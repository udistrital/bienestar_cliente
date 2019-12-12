import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetModificacionFuenteComponent } from './set-modificacion-fuente.component';

describe('SetModificacionFuenteComponent', () => {
  let component: SetModificacionFuenteComponent;
  let fixture: ComponentFixture<SetModificacionFuenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetModificacionFuenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetModificacionFuenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
