import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivosGenericoComponent } from './archivos-generico.component';

describe('ArchivosGenericoComponent', () => {
  let component: ArchivosGenericoComponent;
  let fixture: ComponentFixture<ArchivosGenericoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivosGenericoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivosGenericoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
