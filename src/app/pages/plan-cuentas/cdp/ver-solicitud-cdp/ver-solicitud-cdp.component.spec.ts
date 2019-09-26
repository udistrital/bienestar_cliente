import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerSolicitudCdpComponent } from './ver-solicitud-cdp.component';

describe('VerSolicitudCdpComponent', () => {
  let component: VerSolicitudCdpComponent;
  let fixture: ComponentFixture<VerSolicitudCdpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerSolicitudCdpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerSolicitudCdpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
