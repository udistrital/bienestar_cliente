import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CierreVigenciaComponent } from './cierre-vigencia.component';

describe('CierreVigenciaComponent', () => {
  let component: CierreVigenciaComponent;
  let fixture: ComponentFixture<CierreVigenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CierreVigenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CierreVigenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
