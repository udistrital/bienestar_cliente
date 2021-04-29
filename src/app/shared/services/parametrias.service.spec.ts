import { TestBed } from '@angular/core/testing';

import { ParametriasService } from './parametrias.service';

describe('ParametriasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParametriasService = TestBed.get(ParametriasService);
    expect(service).toBeTruthy();
  });
});
