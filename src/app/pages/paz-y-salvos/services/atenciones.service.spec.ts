/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AtencionesService } from './atenciones.service';

describe('Service: Atenciones', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AtencionesService]
    });
  });

  it('should ...', inject([AtencionesService], (service: AtencionesService) => {
    expect(service).toBeTruthy();
  }));
});
