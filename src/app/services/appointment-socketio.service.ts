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
          },
          'force new connection': true
        });
      } else {
        this.socket = await io(environment.API_URL + 'appointment');
      }

      this.socket.on('update', (data: any) => {
        // If automatic update is allowed
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

      this.socket.on('subscribe-appointment', (data: any) => {
        if (data === 'success') {
          this.websocketSubscriptionValid$.next(true);
          console.log('appointment subscription successful');
          this.retry = 0;
        }
      });

      this.socket.on('exception', () => {
        if (this.retry < 5) {
          setTimeout(() => {
            const link_tmp = this.current_link;
            this.current_link = '';
            this.retry++;
            this.websocketSubscriptionRetryCount$.next(this.retry);

            this.reset();
            this.setupSocketConnection().then(() => {
              this.subscribeToAppointmentUpdates(link_tmp);
            });
          }, 2000);
        }
      });
    }
  }

  subscribeToAppointmentUpdates(link: string) {
    if (link !== this.current_link) {
      this.appointmentProvider.reset();

      this.socket.emit('subscribe-appointment', {appointment: {link}});

      this.reload(link);
    }
  }

  public reload(link) {
    this.current_link = link;
    this.hasUpdate = false;

    this.appointmentService
      .getAppointment(link, false)
      .subscribe(
        (appointment: IAppointmentModel) => {
          this.appointmentProvider.update(appointment);
        }
      );
  }

  public retrySubscription(link: string) {
    this.current_link = '';
    this.retry = 0;
    this.subscribeToAppointmentUpdates(link);
  }

  private reset() {
    this.socket = undefined;
  }
}
