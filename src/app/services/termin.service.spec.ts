import { TestBed } from '@angular/core/testing';

import { TerminService } from './termin.service';

describe('TerminService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TerminService = TestBed.get(TerminService);
    expect(service).toBeTruthy();
  });
});
