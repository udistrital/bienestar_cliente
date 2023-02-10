import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarEventosComponent } from './listar-eventos.component';

describe('ListarEventosComponent', () => {
  let component: ListarEventosComponent;
  let fixture: ComponentFixture<ListarEventosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarEventosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
