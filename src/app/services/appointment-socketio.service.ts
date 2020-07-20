import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {environment} from '../../environments/environment';
import {AppointmentProvider} from '../components/termin/appointment.provider';
import {IAppointmentModel} from '../models/IAppointment.model';
import {AuthenticationService} from './authentication.service';
import {AppointmentService} from './appointment.service';
import {SettingsService} from './settings.service';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentSocketioService {

  constructor(private appointmentProvider: AppointmentProvider, private authenticationService: AuthenticationService,
              private appointmentService: AppointmentService, private settingsService: SettingsService) {
  }

  private socket;
  private current_link = '';

  public _hasUpdate$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public get hasUpdate$(): BehaviorSubject<boolean> {
    return this._hasUpdate$;
  }

  subscribeAppointment(link: string) {
    if (link !== this.current_link) {
      this.appointmentProvider.reset();

      this.socket.emit('subscribe-appointment', {appointment: {link}});

      this.appointmentService
        .getAppointment(link, false)
        .subscribe(
          (appointment: IAppointmentModel) => {
            this.current_link = link;
            this.appointmentProvider.update(appointment);
          }
        );
    }
  }

  public set hasUpdate(value: boolean) {
    this._hasUpdate$.next(value);
  }

  async setupSocketConnection() {
    if (this.socket === undefined || !this.socket.connected) {
      if (this.authenticationService.userIsLoggedIn()) { // add headers if user is logged in
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
        if (this.settingsService.autoLoadOnWsCall
          && this.settingsService.isAllowedByWiFi()) {
          this.appointmentService
            .getAppointment(data, false)
            .subscribe(
              (appointment: IAppointmentModel) => {
                this.appointmentProvider.update(appointment);
              }
            );
        } else {
          this.hasUpdate = true;
        }
      });
    }
  }

  reload(link) {
    this.appointmentService
      .getAppointment(link, false)
      .subscribe(
        (appointment: IAppointmentModel) => {
          this.current_link = link;
          this.appointmentProvider.update(appointment);
          this.hasUpdate = false;
        }
      );
  }
}
