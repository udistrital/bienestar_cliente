import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionApropiacionesComponent } from './gestion-apropiaciones.component';

describe('GestionApropiacionesComponent', () => {
  let component: GestionApropiacionesComponent;
  let fixture: ComponentFixture<GestionApropiacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionApropiacionesComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionApropiacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
