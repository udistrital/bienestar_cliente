import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCdpComponent } from './list-cdp.component';

describe('ListCdpComponent', () => {
  let component: ListCdpComponent;
  let fixture: ComponentFixture<ListCdpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCdpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCdpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
