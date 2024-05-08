import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestorDocumentosComponent } from './gestor-documentos.component';

describe('GestorDocumentosComponent', () => {
  let component: GestorDocumentosComponent;
  let fixture: ComponentFixture<GestorDocumentosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestorDocumentosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestorDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
