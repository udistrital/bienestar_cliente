import { TestBed } from '@angular/core/testing';

import { DocumentosService } from './documentos.service';

describe('DocumentosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DocumentosService = TestBed.get(DocumentosService);
    expect(service).toBeTruthy();
  });
});
