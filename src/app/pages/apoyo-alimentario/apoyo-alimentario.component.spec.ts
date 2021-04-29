import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApoyoAlimentarioComponent } from './apoyo-alimentario.component';

describe('ApoyoAlimentarioComponent', () => {
  let component: ApoyoAlimentarioComponent;
  let fixture: ComponentFixture<ApoyoAlimentarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApoyoAlimentarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApoyoAlimentarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
