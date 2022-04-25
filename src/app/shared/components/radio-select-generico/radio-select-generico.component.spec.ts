import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioSelectGenericoComponent } from './radio-select-generico.component';

describe('RadioSelectGenericoComponent', () => {
  let component: RadioSelectGenericoComponent;
  let fixture: ComponentFixture<RadioSelectGenericoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadioSelectGenericoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioSelectGenericoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
