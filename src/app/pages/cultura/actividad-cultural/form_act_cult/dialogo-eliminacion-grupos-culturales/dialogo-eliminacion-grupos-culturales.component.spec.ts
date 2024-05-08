import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoEliminacionGruposCulturalesComponent } from './dialogo-eliminacion-grupos-culturales.component';

describe('DialogoEliminacionGruposCulturalesComponent', () => {
  let component: DialogoEliminacionGruposCulturalesComponent;
  let fixture: ComponentFixture<DialogoEliminacionGruposCulturalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoEliminacionGruposCulturalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoEliminacionGruposCulturalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
