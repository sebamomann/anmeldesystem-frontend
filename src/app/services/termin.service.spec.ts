import {TestBed} from '@angular/core/testing';

import {AppointmentService} from './appointment.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Globals} from '../globals';

describe('AppointmentService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [Globals]
  }));

  it('should be created', () => {
    const service: AppointmentService = TestBed.get(AppointmentService);
    expect(service).toBeTruthy();
  });
});
