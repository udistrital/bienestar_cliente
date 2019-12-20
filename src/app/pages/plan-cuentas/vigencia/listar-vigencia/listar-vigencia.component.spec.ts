import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarVigenciaComponent } from './listar-vigencia.component';

describe('ListarVigenciaComponent', () => {
  let component: ListarVigenciaComponent;
  let fixture: ComponentFixture<ListarVigenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarVigenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarVigenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
