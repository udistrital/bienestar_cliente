import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCrpComponent } from './list-crp.component';

describe('ListCrpComponent', () => {
  let component: ListCrpComponent;
  let fixture: ComponentFixture<ListCrpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCrpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCrpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
