import { TestBed, async, inject } from '@angular/core/testing';

import { AgendamientoCitasGuard } from './agendamiento-citas.guard';

describe('AgendamientoCitasGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AgendamientoCitasGuard]
    });
  });

  it('should ...', inject([AgendamientoCitasGuard], (guard: AgendamientoCitasGuard) => {
    expect(guard).toBeTruthy();
  }));
});
