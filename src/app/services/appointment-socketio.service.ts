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
  private retry = 0;
  private socket;
  private current_link = '';

  constructor(private appointmentProvider: AppointmentProvider, private authenticationService: AuthenticationService,
              private appointmentService: AppointmentService, private settingsService: SettingsService) {
  }

  public _hasUpdate$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public get hasUpdate$(): BehaviorSubject<boolean> {
    return this._hasUpdate$;
  }

  public set hasUpdate(value: boolean) {
    this._hasUpdate$.next(value);
  }

  public _websocketSubscriptionValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public get websocketSubscriptionValid$(): BehaviorSubject<boolean> {
    return this._websocketSubscriptionValid$;
  }

  public _websocketSubscriptionRetryCount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  public get websocketSubscriptionRetryCount$(): BehaviorSubject<number> {
    return this._websocketSubscriptionRetryCount$;
  }

  async setupSocketConnection(link: string) {
    this.current_link = link;
    if (this.retry === 0) {
      this.reload(link);
    }

    if (this.socket === undefined || !this.socket.connected) {
      if (this.authenticationService.userIsLoggedIn()) { // add headers if user is logged in
        this.socket = await io(environment.API_URL + 'appointment', {
          transportOptions: {
            polling: {
              extraHeaders: {
                Authorization: 'Bearer ' + this.authenticationService.currentUserValue.token
              }
            }
          },
          'force new connection': true
        });
      } else {
        this.socket = await io(environment.API_URL + 'appointment');
      }

      this.socket.on('connect', () => {
        this.subscribeToAppointmentUpdates(this.current_link);
      });

      this.socket.on('update', (_link: any) => {
        // If automatic update is allowed
        if (this.settingsService.autoLoadOnWsCall
          && this.settingsService.isAllowedByWiFi()) {
          this.loadAppointment(_link);
        } else {
          this.hasUpdate = true;
        }
      });

      this.socket.on('subscribe-appointment', (data: any) => {
        if (data === 'success') {
          this.websocketSubscriptionValid$.next(true);
          console.log('appointment subscription successful');
          this.retry = 0;
          this.websocketSubscriptionRetryCount$.next(this.retry);
        }
      });

      this.socket.on('exception', () => {
        if (this.retry < 5) {
          setTimeout(() => {
            this.retry++;
            this.websocketSubscriptionRetryCount$.next(this.retry);

            this.resetSocket();

            this.setupSocketConnection(this.current_link);
          }, 2000);
        }
      });
    }
  }

  subscribeToAppointmentUpdates(link: string) {
    this.socket.emit('subscribe-appointment', {appointment: {link}});
  }

  public reload(link) {
    this.appointmentProvider.reset();

    this.current_link = link;
    this.hasUpdate = false;

    this.loadAppointment(link);
  }

  public retrySubscription(link: string) {
    this.current_link = '';
    this.retry = 0;
    this.subscribeToAppointmentUpdates(link);
  }

  loadAppointment(data: any) {
    this.appointmentService
      .getAppointment(data, false)
      .subscribe(
        (appointment: IAppointmentModel) => {
          this.appointmentProvider.update(appointment);
        }
      );
  }

  private resetSocket() {
    this.socket = undefined;
  }
}
