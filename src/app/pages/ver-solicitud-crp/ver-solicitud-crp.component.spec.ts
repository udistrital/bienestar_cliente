import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerSolicitudCrpComponent } from './ver-solicitud-crp.component';

describe('VerSolicitudCrpComponent', () => {
  let component: VerSolicitudCrpComponent;
  let fixture: ComponentFixture<VerSolicitudCrpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerSolicitudCrpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerSolicitudCrpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
