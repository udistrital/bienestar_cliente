import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RubrosFuenteComponent } from './rubros-fuente.component';

describe('RubrosFuenteComponent', () => {
  let component: RubrosFuenteComponent;
  let fixture: ComponentFixture<RubrosFuenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RubrosFuenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RubrosFuenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
