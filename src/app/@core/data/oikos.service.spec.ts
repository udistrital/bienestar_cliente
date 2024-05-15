import { TestBed } from '@angular/core/testing';

import { OikosService } from './oikos.service';

describe('OikosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OikosService = TestBed.get(OikosService);
    expect(service).toBeTruthy();
  });
});
