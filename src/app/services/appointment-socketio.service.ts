import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentSocketioService {

  private socket;

  constructor() {
  }

  async setupSocketConnection() {
    this.socket = await io(environment.API_URL + 'appointment');

    this.socket.on('update', (data: string) => {
      console.log(data);
    });
  }

  subscribeAppointment(link: string) {
    this.socket.emit('subscribe-appointment', link);
  }
}
