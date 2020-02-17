import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSolicitudCrpComponent } from './list-solicitud-crp.component';

describe('ConsultaCrpComponent', () => {
  let component: ListSolicitudCrpComponent;
  let fixture: ComponentFixture<ListSolicitudCrpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSolicitudCrpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSolicitudCrpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
