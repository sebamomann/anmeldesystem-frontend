import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {environment} from '../../environments/environment';
import {AppointmentProvider} from '../components/termin/appointment.provider';
import {IAppointmentModel} from '../models/IAppointment.model';
import {AuthenticationService} from './authentication.service';
import {AppointmentService} from './appointment.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentSocketioService {

  private socket;

  constructor(private appointmentProvider: AppointmentProvider, private authenticationService: AuthenticationService,
              private appointmentService: AppointmentService) {
  }

  async setupSocketConnection() {
    if (this.authenticationService.currentUserValue !== null) {
      this.socket = await io(environment.API_URL + 'appointment', {
        transportOptions: {
          polling: {
            extraHeaders: {
              Authorization: 'Bearer ' + this.authenticationService.currentUserValue.token
            }
          }
        }
      });
    } else {
      this.socket = await io(environment.API_URL + 'appointment');
    }

    this.socket.on('update', (data: any) => {
      console.log('Update available for Appointment', data);

      this.appointmentService
        .getAppointment(data, false)
        .subscribe(
          (appointment: IAppointmentModel) => {
            this.appointmentProvider.update(appointment);
          }
        );
    });
  }

  subscribeAppointment(link: string) {
    this.socket.emit('subscribe-appointment', {appointment: {link}});

    this.appointmentService
      .getAppointment(link, false)
      .subscribe(
        (appointment: IAppointmentModel) => {
          this.appointmentProvider.update(appointment);
        }
      );
  }
}
