import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PDFviewerComponent } from './pdfviewer.component';

describe('PDFviewerComponent', () => {
  let component: PDFviewerComponent;
  let fixture: ComponentFixture<PDFviewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PDFviewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PDFviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
