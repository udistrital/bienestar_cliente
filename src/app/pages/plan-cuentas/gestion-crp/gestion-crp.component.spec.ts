import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCrpComponent } from './gestion-crp.component';

describe('GestionCrpComponent', () => {
  let component: GestionCrpComponent;
  let fixture: ComponentFixture<GestionCrpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionCrpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionCrpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
