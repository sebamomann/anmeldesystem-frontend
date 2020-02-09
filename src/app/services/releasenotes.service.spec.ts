import {TestBed} from '@angular/core/testing';

import {ReleasenotesService} from './releasenotes.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('ReleasenotesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, BrowserAnimationsModule]
  }));

  it('should be created', () => {
    const service: ReleasenotesService = TestBed.get(ReleasenotesService);
    expect(service).toBeTruthy();
  });
});
