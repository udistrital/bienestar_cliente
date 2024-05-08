import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InscritosComponent } from './inscritos.component';

describe('InscritosComponent', () => {
  let component: InscritosComponent;
  let fixture: ComponentFixture<InscritosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InscritosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InscritosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('Cargar sedes', function () {
  let component: InscritosComponent;
  component.cargarSedes().then((resp) => {
    expect(resp).toBe(true);
  }).catch((err) => {
    expect(typeof (err)).toBe(typeof ("err"));
  });
});