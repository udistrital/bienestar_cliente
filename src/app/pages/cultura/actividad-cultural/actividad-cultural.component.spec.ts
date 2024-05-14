import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadCulturalComponent } from './actividad-cultural.component';

describe('ActividadCulturalComponent', () => {
  let component: ActividadCulturalComponent;
  let fixture: ComponentFixture<ActividadCulturalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActividadCulturalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActividadCulturalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
