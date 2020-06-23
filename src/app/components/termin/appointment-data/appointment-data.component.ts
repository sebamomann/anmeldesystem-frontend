import {Component, Inject, Input, OnInit} from '@angular/core';
import {UrlService} from '../../../services/url.service';
import {MatSnackBar} from '@angular/material';
import {IAppointmentModel} from '../../../models/IAppointment.model';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {WINDOW} from '../../../provider/window.provider';
import {environment} from '../../../../environments/environment';
import {AppointmentService} from '../../../services/appointment.service';
import {AppointmentUtil} from '../../../_util/appointmentUtil.util';
import {AuthenticationService} from '../../../services/authentication.service';

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

  public userIsLoggedIn: boolean = this.authenticationService.currentUserValue !== null;
  public isPinned = false;

  constructor(public urlService: UrlService, private snackBar: MatSnackBar, private router: Router,
              public sanitizer: DomSanitizer, @Inject(WINDOW) public window: Window,
              private appointmentService: AppointmentService, private authenticationService: AuthenticationService) {
    if (!this.preview) {
      this.type = '';
    }
  }

  ngOnInit() {
    this.isPinned = this.appointment.reference.includes('PINNED');

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

  settings() {
    this.router.navigate(['appointment/settings'], {queryParamsHandling: 'merge'});
  }

  pin() {
    if (this.userIsLoggedIn) {
      this.appointmentService
        .pin(this.appointment.link)
        .toPromise()
        .then(() => {
        });
    }

    let msg = '';
    if (this.isPinned) {
      msg = 'Pin entfernt';
      this.isPinned = false;
      AppointmentUtil.unpin(this.appointment.link);
    } else {
      msg = 'Angepinnt';
      this.isPinned = true;
      AppointmentUtil.pin(this.appointment.link);
    }

    this.snackBar.open(msg,
      '',
      {
        duration: 2000,
        panelClass: 'snackbar-default'
      });
  }
}
