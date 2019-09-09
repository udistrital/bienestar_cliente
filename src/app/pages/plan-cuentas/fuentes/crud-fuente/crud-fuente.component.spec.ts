import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudFuenteComponent } from './crud-fuente.component';

describe('CrudFuenteComponent', () => {
  let component: CrudFuenteComponent;
  let fixture: ComponentFixture<CrudFuenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrudFuenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudFuenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
