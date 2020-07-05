import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowVigenciaComponent } from './show-vigencia.component';

describe('ShowVigenciaComponent', () => {
  let component: ShowVigenciaComponent;
  let fixture: ComponentFixture<ShowVigenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowVigenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowVigenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
