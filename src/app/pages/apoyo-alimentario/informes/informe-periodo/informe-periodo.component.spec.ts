import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformePeriodoComponent } from './informe-periodo.component';

describe('InformePeriodoComponent', () => {
  let component: InformePeriodoComponent;
  let fixture: ComponentFixture<InformePeriodoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformePeriodoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformePeriodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
