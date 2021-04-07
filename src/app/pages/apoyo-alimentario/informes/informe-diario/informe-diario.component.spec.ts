import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeDiarioComponent } from './informe-diario.component';

describe('InformeDiarioComponent', () => {
  let component: InformeDiarioComponent;
  let fixture: ComponentFixture<InformeDiarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformeDiarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeDiarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
