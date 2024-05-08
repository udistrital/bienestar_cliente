import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionDocumentalComponent } from './gestion-documental.component';


describe('GestionDocumentalComponent', () => {
  let component: GestionDocumentalComponent;
  let fixture: ComponentFixture<GestionDocumentalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionDocumentalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionDocumentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
