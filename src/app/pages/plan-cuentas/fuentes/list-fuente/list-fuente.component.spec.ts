import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFuenteComponent } from './list-fuente.component';

describe('ListFuenteComponent', () => {
  let component: ListFuenteComponent;
  let fixture: ComponentFixture<ListFuenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListFuenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFuenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
