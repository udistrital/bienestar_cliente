import { TestBed } from '@angular/core/testing';

import { AcademicaJbpmService } from './academica-jbpm.service';

describe('AcademicaJbpmService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AcademicaJbpmService = TestBed.get(AcademicaJbpmService);
    expect(service).toBeTruthy();
  });
});
