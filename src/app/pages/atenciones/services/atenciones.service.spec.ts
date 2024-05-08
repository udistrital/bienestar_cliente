import { TestBed } from '@angular/core/testing';

import { AtencionesService } from './atenciones.service';

describe('AtencionesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AtencionesService = TestBed.get(AtencionesService);
    expect(service).toBeTruthy();
  });
});
