import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoActividadesCulturalesComponent } from './dialogo-actividades-culturales.component';

describe('DialogoActividadesCulturalesComponent', () => {
  let component: DialogoActividadesCulturalesComponent;
  let fixture: ComponentFixture<DialogoActividadesCulturalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoActividadesCulturalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoActividadesCulturalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
