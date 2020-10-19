import { TestBed } from '@angular/core/testing';

import { MenuCitasService } from './menu-citas.service';

describe('MenuCitasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MenuCitasService = TestBed.get(MenuCitasService);
    expect(service).toBeTruthy();
  });
});
