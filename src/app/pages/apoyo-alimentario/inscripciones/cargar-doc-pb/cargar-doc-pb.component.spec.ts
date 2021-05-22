import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargarDocPbComponent } from './cargar-doc-pb.component';

describe('CargarDocPbComponent', () => {
  let component: CargarDocPbComponent;
  let fixture: ComponentFixture<CargarDocPbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargarDocPbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargarDocPbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
