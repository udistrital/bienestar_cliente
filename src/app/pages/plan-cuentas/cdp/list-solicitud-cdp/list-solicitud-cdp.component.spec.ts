import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSolicitudCdpComponent } from './list-solicitud-cdp.component';

describe('ListSolicitudCdpComponent', () => {
  let component: ListSolicitudCdpComponent;
  let fixture: ComponentFixture<ListSolicitudCdpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSolicitudCdpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSolicitudCdpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
