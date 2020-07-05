import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudCrpComponent } from './solicitud-crp.component';

describe('SolicitudCrpComponent', () => {
  let component: SolicitudCrpComponent;
  let fixture: ComponentFixture<SolicitudCrpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudCrpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudCrpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
