import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComboGenericoComponent } from './combo-generico.component';

describe('ComboGenericoComponent', () => {
  let component: ComboGenericoComponent;
  let fixture: ComponentFixture<ComboGenericoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComboGenericoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComboGenericoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
