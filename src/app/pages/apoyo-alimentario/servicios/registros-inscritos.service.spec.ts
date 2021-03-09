import { TestBed } from '@angular/core/testing';

import { RegistrosInscritosService } from './registros-inscritos.service';

describe('RegistrosInscritosService', () => {
  let service: RegistrosInscritosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistrosInscritosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
