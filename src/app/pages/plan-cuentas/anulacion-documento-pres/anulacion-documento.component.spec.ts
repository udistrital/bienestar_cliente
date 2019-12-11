import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApropiacionesComponent } from './anulacion-documento.component';

describe('ApropiacionesComponent', () => {
  let component: ApropiacionesComponent;
  let fixture: ComponentFixture<ApropiacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApropiacionesComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApropiacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
