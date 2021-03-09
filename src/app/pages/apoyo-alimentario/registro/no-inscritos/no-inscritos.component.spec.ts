import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoInscritosComponent } from './no-inscritos.component';

describe('NoInscritosComponent', () => {
  let component: NoInscritosComponent;
  let fixture: ComponentFixture<NoInscritosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoInscritosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoInscritosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
