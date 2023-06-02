/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Base64imagesComponent } from './base64images.component';

describe('Base64imagesComponent', () => {
  let component: Base64imagesComponent;
  let fixture: ComponentFixture<Base64imagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Base64imagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Base64imagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
