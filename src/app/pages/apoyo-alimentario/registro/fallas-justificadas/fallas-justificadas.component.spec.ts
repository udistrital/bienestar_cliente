import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FallasJustificadasComponent } from './fallas-justificadas.component';

describe('FallasJustificadasComponent', () => {
  let component: FallasJustificadasComponent;
  let fixture: ComponentFixture<FallasJustificadasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FallasJustificadasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FallasJustificadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
