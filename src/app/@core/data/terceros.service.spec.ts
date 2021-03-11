import { TestBed } from '@angular/core/testing';

import { TercerosService } from './terceros.service';

describe('TercerosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TercerosService = TestBed.get(TercerosService);
    expect(service).toBeTruthy();
  });
});
