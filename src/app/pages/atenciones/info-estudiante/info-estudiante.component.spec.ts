import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoEstudianteComponent } from './info-estudiante.component';

describe('InfoEstudianteComponent', () => {
  let component: InfoEstudianteComponent;
  let fixture: ComponentFixture<InfoEstudianteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoEstudianteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
