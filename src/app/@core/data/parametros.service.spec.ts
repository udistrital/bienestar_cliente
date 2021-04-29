import { TestBed } from '@angular/core/testing';

import { ParametrosService } from './parametros.service';

describe('ParametrosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParametrosService = TestBed.get(ParametrosService);
    expect(service).toBeTruthy();
  });
});
