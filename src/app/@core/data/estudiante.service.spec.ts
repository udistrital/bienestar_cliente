import { TestBed } from '@angular/core/testing';

import { EstudianteService } from './estudiante.service';

describe('EstudianteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EstudianteService = TestBed.get(EstudianteService);
    expect(service).toBeTruthy();
  });
});
