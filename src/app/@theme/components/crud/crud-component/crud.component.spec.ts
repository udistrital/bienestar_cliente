import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudEntityComponent } from './crud.component';

describe('CrudEntityComponent', () => {
  let component: CrudEntityComponent;
  let fixture: ComponentFixture<CrudEntityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrudEntityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
