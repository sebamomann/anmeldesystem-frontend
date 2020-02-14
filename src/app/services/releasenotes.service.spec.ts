import {TestBed} from '@angular/core/testing';

import {ReleasenotesService} from './releasenotes.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('ReleasenotesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: ReleasenotesService = TestBed.get(ReleasenotesService);
    expect(service).toBeTruthy();
  });
});
