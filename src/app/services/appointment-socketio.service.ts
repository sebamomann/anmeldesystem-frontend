import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {environment} from '../../environments/environment';
import {AppointmentProvider} from '../components/termin/appointment.provider';
import {IAppointmentModel} from '../models/IAppointment.model';
import {AuthenticationService} from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentSocketioService {

  private socket;

  constructor(private appointmentProvider: AppointmentProvider, private authenticationService: AuthenticationService) {
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
      console.log(this.authenticationService.currentUserValue.token);
    } else {
      this.socket = await io(environment.API_URL + 'appointment');
    }

    this.socket.on('update', (data: IAppointmentModel) => {
      this.appointmentProvider.update(data);
    });
  }

  subscribeAppointment(link: string) {
    this.socket.emit('subscribe-appointment', {appointment: {link}});
  }
}
