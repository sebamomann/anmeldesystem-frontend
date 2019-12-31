import {TestBed} from '@angular/core/testing';

import {TerminService} from './termin.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('TerminService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
  }));

  it('should be created', () => {
    const service: TerminService = TestBed.get(TerminService);
    expect(service).toBeTruthy();
  });
});
