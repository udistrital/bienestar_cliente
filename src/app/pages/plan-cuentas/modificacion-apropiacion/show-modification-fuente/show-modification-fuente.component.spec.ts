import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowModificationFuenteComponent } from './show-modification-fuente.component';

describe('ShowModificationFuenteComponent', () => {
  let component: ShowModificationFuenteComponent;
  let fixture: ComponentFixture<ShowModificationFuenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowModificationFuenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowModificationFuenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
