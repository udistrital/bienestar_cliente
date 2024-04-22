import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirEvidenciasActividadesComponent } from './subir-evidencias-actividades.component';

describe('SubirEvidenciasActividadesComponent', () => {
  let component: SubirEvidenciasActividadesComponent;
  let fixture: ComponentFixture<SubirEvidenciasActividadesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubirEvidenciasActividadesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubirEvidenciasActividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
