import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionEstudianteComponent } from './informacion-estudiante.component';

describe('InformacionEstudianteComponent', () => {
  let component: InformacionEstudianteComponent;
  let fixture: ComponentFixture<InformacionEstudianteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformacionEstudianteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacionEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
