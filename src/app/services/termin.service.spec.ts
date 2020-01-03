import {TestBed} from '@angular/core/testing';

import {AppointmentService} from './appointment.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('TerminService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
  }));

  it('should be created', () => {
    const service: AppointmentService = TestBed.get(AppointmentService);
    expect(service).toBeTruthy();
  });
});
