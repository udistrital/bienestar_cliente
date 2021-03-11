import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FechaCrudComponent } from './fecha-crud.component';

describe('FechaCrudComponent', () => {
  let component: FechaCrudComponent;
  let fixture: ComponentFixture<FechaCrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FechaCrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FechaCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
