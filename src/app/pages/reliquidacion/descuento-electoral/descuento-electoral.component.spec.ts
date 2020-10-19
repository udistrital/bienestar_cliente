import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DescuentoElectoralComponent } from './descuento-electoral.component';

describe('DescuentoElectoralComponent', () => {
  let component: DescuentoElectoralComponent;
  let fixture: ComponentFixture<DescuentoElectoralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescuentoElectoralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescuentoElectoralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
