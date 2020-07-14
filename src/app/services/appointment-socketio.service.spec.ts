import {TestBed} from '@angular/core/testing';

import {AppointmentSocketioService} from './appointment-socketio.service';

describe('AppointmentSocketioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppointmentSocketioService = TestBed.get(AppointmentSocketioService);
    expect(service).toBeTruthy();
  });
});
