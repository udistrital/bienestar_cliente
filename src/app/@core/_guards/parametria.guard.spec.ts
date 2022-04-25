import { TestBed, async, inject } from '@angular/core/testing';

import { ParametriaGuard } from './parametria.guard';

describe('ParametriaGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ParametriaGuard]
    });
  });

  it('should ...', inject([ParametriaGuard], (guard: ParametriaGuard) => {
    expect(guard).toBeTruthy();
  }));
});
