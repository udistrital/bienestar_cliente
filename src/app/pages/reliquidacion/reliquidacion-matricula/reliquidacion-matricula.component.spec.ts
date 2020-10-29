import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReliquidacionMatriculaComponent } from './reliquidacion-matricula.component';

describe('ReliquidacionMatriculaComponent', () => {
  let component: ReliquidacionMatriculaComponent;
  let fixture: ComponentFixture<ReliquidacionMatriculaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReliquidacionMatriculaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReliquidacionMatriculaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
