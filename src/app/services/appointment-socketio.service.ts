import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { AppointmentProvider } from '../components/termin/appointment.provider';
import { SettingsService } from './settings.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentSocketioService {
  private socket;
  private subscription = '';

  constructor(private appointmentProvider: AppointmentProvider,
    private settingsService: SettingsService) {
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

  public async setupSocketConnection() {
    if (this.socket === undefined || !this.socket.connected) {
      if (this.socket) {
        this.socket.close();
      }

      // if (this.authenticationService.userIsLoggedIn()) { // add headers if user is logged in
      //   this.socket = await io(environment.API_URL + 'appointment', {
      //     transportOptions: {
      //       polling: {
      //         extraHeaders: {
      //           Authorization: 'Bearer ' + this.authenticationService.currentUserValue.token // CURRENTLY USELESS
      //         }
      //       }
      //     },
      //
      //     'force new connection': true
      //   });
      // } else {
      this.socket = await io(environment.API_URL + 'appointment', {
        forceNew: true,
        reconnectionAttempts: 5,
      });
      // }

      this.socket.on('reconnect_attempt', (attempt) => {
        this.websocketSubscriptionRetryCount$.next(attempt);
        this.websocketSubscriptionValid$.next(false);
      });

      this.socket.on('reconnect', (attempt) => {
        this.websocketSubscriptionRetryCount$.next(attempt);
        this.websocketSubscriptionValid$.next(false);
      });

      this.socket.on('connect', () => {
        this.websocketSubscriptionValid$.next(true);
        this.websocketSubscriptionRetryCount$.next(0);

        this.socket.on('update', (_link: any) => {
          console.log('SOCKET UPDATE');
          if (this.subscription === _link) {
            // If automatic update is allowed
            if (this.settingsService.autoLoadOnWsCall
              && this.settingsService.isAllowedByWiFi()) {
              this.appointmentProvider.loadAppointment(_link);
            } else {
              this.hasUpdate = true;
            }
          }
        });

        this.socket.on('subscribe-appointment', (data: any) => {
          if (data === 'success') {
            console.log('websocket subscribed');
          }
        });
      });

      this.socket.on('disconnect', () => {
        console.log('websocket disconnected');
        this.reactivateWebsocketConnection();
      });

      this.socket.on('exception', () => {
        this.reactivateWebsocketConnection();
      });
    }
  }

  public subscribeToAppointmentUpdates(link: string) {
    if (this.subscription && this.subscription !== link) { // if not first
      this.appointmentProvider.reset();
    }

    this.subscription = link;
    this.socket.emit('subscribe-appointment', { appointment: { link } });
  }

  public reload(_link: string) {
    this.appointmentProvider.reset();

    this.hasUpdate = false;

    this.appointmentProvider.loadAppointment(_link);
  }

  // public retrySubscription(link: string) {
  //   this.connectionRetry = 0;
  //
  //   this.subscribeToAppointmentUpdates(link);
  // }

  public reactivateWebsocketConnection = () => {
    this.setupSocketConnection()
      .then(() => {
        this.subscribeToAppointmentUpdates(this.subscription);
      });
  };

  // private resetSocket() {
  //   this.socket = undefined;
  // }
}
