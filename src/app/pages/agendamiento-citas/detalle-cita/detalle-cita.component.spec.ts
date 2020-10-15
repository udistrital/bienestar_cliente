import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleCitaComponent } from './detalle-cita.component';

describe('DetalleCitaComponent', () => {
  let component: DetalleCitaComponent;
  let fixture: ComponentFixture<DetalleCitaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleCitaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleCitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
