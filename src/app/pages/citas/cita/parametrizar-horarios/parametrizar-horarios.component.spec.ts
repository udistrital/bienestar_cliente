import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrizarHorariosComponent } from './parametrizar-horarios.component';

describe('ParametrizarHorariosComponent', () => {
  let component: ParametrizarHorariosComponent;
  let fixture: ComponentFixture<ParametrizarHorariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametrizarHorariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametrizarHorariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
