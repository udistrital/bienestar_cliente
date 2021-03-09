import { TestBed } from '@angular/core/testing';

import { InscripcionesService } from './inscripciones.service';

describe('InscripcionesService', () => {
  let service: InscripcionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InscripcionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
