import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DependenciasComponent } from './dependencias.component';

describe('DependenciasComponent', () => {
  let component: DependenciasComponent;
  let fixture: ComponentFixture<DependenciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DependenciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DependenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
