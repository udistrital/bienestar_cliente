import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoGruposCulturalesComponent } from './dialogo-grupos-culturales.component';

describe('DialogoGruposCulturalesComponent', () => {
  let component: DialogoGruposCulturalesComponent;
  let fixture: ComponentFixture<DialogoGruposCulturalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoGruposCulturalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoGruposCulturalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
