import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaPazysalvosComponent } from './tabla-pazysalvos.component';

describe('TablaPazysalvosComponent', () => {
  let component: TablaPazysalvosComponent;
  let fixture: ComponentFixture<TablaPazysalvosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaPazysalvosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaPazysalvosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
