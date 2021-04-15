import {Component, Inject, Input, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {IAppointmentModel} from '../../../models/IAppointment.model';
import {Router} from '@angular/router';
import {WINDOW} from '../../../provider/window.provider';
import {environment} from '../../../../environments/environment';
import {AppointmentService} from '../../../services/appointment.service';
import {AppointmentUtil} from '../../../_util/appointmentUtil.util';
import {AuthenticationService} from '../../../services/authentication.service';
import {PushService} from '../../../services/push.service';

@Component({
  selector: 'app-appointment-data',
  templateUrl: './appointment-data.component.html',
  styleUrls: ['./appointment-data.component.scss'],
})
export class AppointmentDataComponent implements OnInit {

  public apiUrl = environment.API_URL;

  @Input() public appointment: IAppointmentModel;
  @Input() public preview = false;
  @Input() public type: string;

  public userIsLoggedIn: boolean = this.authenticationService.userIsLoggedIn();
  public isPinned = false;

  public appointmentNotificationSubscribed: boolean;

  constructor(private snackBar: MatSnackBar, private router: Router, @Inject(WINDOW) public window: Window,
              private appointmentService: AppointmentService, private authenticationService: AuthenticationService,
              private pushService: PushService) {
    if (!this.preview) {
      this.type = '';
    }
  }

  async ngOnInit() {
    this.pushService.isSubscribed(this.appointment.link)
      .then((val) => {
        val.subscribe(() => {
          this.appointmentNotificationSubscribed = true;
        }, (err) => {
          this.appointmentNotificationSubscribed = false;
        });
      });

    this.isPinned = (this.appointment.relations && this.appointment.relations.includes('PINNED'));

    // PIN TO LOCAL IN CASE IT WAS ONLY PINNED ON ACCOUNT
    if (this.isPinned) {
      AppointmentUtil.pin(this.appointment.link);
    }
  }

  redirectToAppointment(appointment: IAppointmentModel) {
    this.router.navigate(['/enroll'], {queryParams: {a: appointment.link}});
  }

  copyLink() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = window.location.protocol + '//' + window.location.hostname + '/' + this.appointment.link;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.snackBar.open('Link in die Zwischenablage kopiert', null, {
      duration: 4000,
      panelClass: 'snackbar-default'
    });
  }

  share() {
    let newVariable: any;

    newVariable = window.navigator;

    if (newVariable && newVariable.share) {
      newVariable.share({
        title: this.appointment.title,
        text: this.appointment.title + ' - ' + this.appointment.description,
        url: window.location.protocol + '//' + window.location.hostname + '/' + this.appointment.link
      })
        .then(() => console.log('Successful share'))
        .catch((error) => this.copyLink());
    } else {
      this.copyLink();
    }
  }

  settings() {
    this.router.navigate(['appointment/settings'], {queryParamsHandling: 'merge'});
  }

  pin() {
    let msg = '';
    if (this.isPinned) {
      if (this.userIsLoggedIn) {
        this.appointmentService
          .unpin(this.appointment.link)
          .toPromise()
          .then(() => {
            msg = 'Pin entfernt';
            this.isPinned = false;
            const index = this.appointment.relations.indexOf('PINNED');
            this.appointment.relations.splice(index, 1);
            AppointmentUtil.unpin(this.appointment.link);

            this.snackBar.open(msg,
              '',
              {
                duration: 2000,
                panelClass: 'snackbar-default'
              });
          });
      }
    } else {
      if (this.userIsLoggedIn) {
        this.appointmentService
          .pin(this.appointment.link)
          .toPromise()
          .then(() => {
            msg = 'Angepinnt';
            this.isPinned = true;
            AppointmentUtil.pin(this.appointment.link);

            this.snackBar.open(msg,
              '',
              {
                duration: 2000,
                panelClass: 'snackbar-default'
              });
          });
      }
    }
  }

  activateNotifications() {
    this.pushService
      .subscribeTo(this.appointment.link)
      .then(() => {
        this.appointmentNotificationSubscribed = true;
        this.snackBar.open('Benachrichtigungen aktiviert', 'OK', {
            duration: 1500
          }
        );
      })
      .catch(() => {
        this.snackBar.open('Benachrichtigungen konnten nicht aktiviert werden', 'OK', {
          duration: 1500
        });
      });
  }

  async deactivateNotifications() {
    (await this.pushService
      .unsubscribeFromAppointment(this.appointment.link))
      .subscribe(() => {
          this.appointmentNotificationSubscribed = false;
          this.snackBar.open('Benachrichtigungen deaktiviert', 'OK', {
              duration: 1500
            }
          );
        },
        () => {
          this.snackBar.open('Benachrichtigungen konnten nicht deaktiviert werden', 'OK', {
            duration: 2500
          });
        });
  }
}
