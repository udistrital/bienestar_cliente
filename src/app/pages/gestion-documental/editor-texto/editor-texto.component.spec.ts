import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorTextoComponent } from './editor-texto.component';

describe('EditorTextoComponent', () => {
  let component: EditorTextoComponent;
  let fixture: ComponentFixture<EditorTextoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorTextoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorTextoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
