import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPlanCuentasComponent } from './gestion-plan-cuentas.component';

describe('GestionPlanCuentasComponent', () => {
  let component: GestionPlanCuentasComponent;
  let fixture: ComponentFixture<GestionPlanCuentasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionPlanCuentasComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionPlanCuentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
