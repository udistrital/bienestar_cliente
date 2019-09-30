import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaCrpComponent } from './consulta-crp.component';

describe('ConsultaCrpComponent', () => {
  let component: ConsultaCrpComponent;
  let fixture: ComponentFixture<ConsultaCrpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaCrpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaCrpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
