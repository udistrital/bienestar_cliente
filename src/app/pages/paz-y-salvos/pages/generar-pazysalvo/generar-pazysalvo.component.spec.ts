import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarPazysalvoComponent } from './generar-pazysalvo.component';

describe('GenerarPazysalvoComponent', () => {
  let component: GenerarPazysalvoComponent;
  let fixture: ComponentFixture<GenerarPazysalvoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerarPazysalvoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarPazysalvoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
