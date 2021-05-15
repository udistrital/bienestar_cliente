import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionMasivaComponent } from './evaluacion-masiva.component';

describe('EvaluacionMasivaComponent', () => {
  let component: EvaluacionMasivaComponent;
  let fixture: ComponentFixture<EvaluacionMasivaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluacionMasivaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluacionMasivaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
