import {TestBed} from '@angular/core/testing';

import {ReleasenotesService} from './releasenotes.service';

describe('ReleasenotesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReleasenotesService = TestBed.get(ReleasenotesService);
    expect(service).toBeTruthy();
  });
});
