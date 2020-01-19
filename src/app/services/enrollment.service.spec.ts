import {TestBed} from '@angular/core/testing';

import {EnrollmentService} from './enrollment.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('EnrollmentService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: EnrollmentService = TestBed.get(EnrollmentService);
    expect(service).toBeTruthy();
  });
});
