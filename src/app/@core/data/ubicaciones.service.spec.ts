import { TestBed } from '@angular/core/testing';

import { UbicacionesService } from './ubicaciones.service';

describe('UbicacionesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UbicacionesService = TestBed.get(UbicacionesService);
    expect(service).toBeTruthy();
  });
});
