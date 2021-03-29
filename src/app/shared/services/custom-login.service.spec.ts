import { TestBed } from '@angular/core/testing';

import { CustomLoginService } from './custom-login.service';

describe('CustomLoginService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomLoginService = TestBed.get(CustomLoginService);
    expect(service).toBeTruthy();
  });
});
