import { TestBed } from '@angular/core/testing';

import { FechasService } from './fechas.service';

describe('FechasService', () => {
  let service: FechasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FechasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
