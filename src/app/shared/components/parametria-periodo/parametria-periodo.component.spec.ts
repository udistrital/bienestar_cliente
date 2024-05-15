import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametriaPeriodoComponent } from './parametria-periodo.component';

describe('ParametriaPeriodoComponent', () => {
  let component: ParametriaPeriodoComponent;
  let fixture: ComponentFixture<ParametriaPeriodoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametriaPeriodoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametriaPeriodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
