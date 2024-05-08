import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGrupCultComponent } from './form-grup-cult.component';

describe('FormGrupCultComponent', () => {
  let component: FormGrupCultComponent;
  let fixture: ComponentFixture<FormGrupCultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormGrupCultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormGrupCultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
