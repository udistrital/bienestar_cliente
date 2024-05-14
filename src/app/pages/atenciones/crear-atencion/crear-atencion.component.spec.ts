import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearAtencionComponent } from './crear-atencion.component';

describe('CrearAtencionComponent', () => {
  let component: CrearAtencionComponent;
  let fixture: ComponentFixture<CrearAtencionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearAtencionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearAtencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
