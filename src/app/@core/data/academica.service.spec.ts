import { TestBed } from '@angular/core/testing';

import { AcademicaService } from './academica.service';

describe('AcademicaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AcademicaService = TestBed.get(AcademicaService);
    expect(service).toBeTruthy();
  });
});
