import { TestBed } from '@angular/core/testing';

import { IncripcionEstudianteService } from './incripcion-estudiante.service';

describe('IncripcionEstudianteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IncripcionEstudianteService = TestBed.get(IncripcionEstudianteService);
    expect(service).toBeTruthy();
  });
});
