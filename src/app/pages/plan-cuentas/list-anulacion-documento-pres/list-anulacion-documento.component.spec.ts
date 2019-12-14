import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAnulacionDocumentoComponent } from './list-anulacion-documento.component';

describe('ListAnulacionDocumentoComponent', () => {
  let component: ListAnulacionDocumentoComponent;
  let fixture: ComponentFixture<ListAnulacionDocumentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAnulacionDocumentoComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAnulacionDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
