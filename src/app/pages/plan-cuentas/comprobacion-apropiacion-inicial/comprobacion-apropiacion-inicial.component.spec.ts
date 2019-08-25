import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprobacionApropiacionInicialComponent } from './comprobacion-apropiacion-inicial.component';

describe('ComprobacionApropiacionInicialComponent', () => {
  let component: ComprobacionApropiacionInicialComponent;
  let fixture: ComponentFixture<ComprobacionApropiacionInicialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprobacionApropiacionInicialComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprobacionApropiacionInicialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
