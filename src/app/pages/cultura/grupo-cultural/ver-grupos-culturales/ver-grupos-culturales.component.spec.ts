import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerGruposCulturalesComponent } from './ver-grupos-culturales.component';

describe('VerGruposCulturalesComponent', () => {
  let component: VerGruposCulturalesComponent;
  let fixture: ComponentFixture<VerGruposCulturalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerGruposCulturalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerGruposCulturalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
