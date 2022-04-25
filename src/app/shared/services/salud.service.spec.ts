import { TestBed } from '@angular/core/testing';

import { SaludService } from './salud.service';

describe('SaludService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SaludService = TestBed.get(SaludService);
    expect(service).toBeTruthy();
  });
});
