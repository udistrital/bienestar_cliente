import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosRubroComponent } from './productos-rubro.component';

describe('ProductosRubroComponent', () => {
  let component: ProductosRubroComponent;
  let fixture: ComponentFixture<ProductosRubroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductosRubroComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductosRubroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
