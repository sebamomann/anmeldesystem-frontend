import {Component, Inject, Input, OnInit} from '@angular/core';
import {UrlService} from '../../../services/url.service';
import {MatSnackBar} from '@angular/material';
import {IAppointmentModel} from '../../../models/IAppointment.model';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {WINDOW} from '../../../provider/window.provider';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-appointment-data',
  templateUrl: './appointment-data.component.html',
  styleUrls: ['./appointment-data.component.scss'],
})
export class AppointmentDataComponent implements OnInit {

  public apiUrl = environment.api.url;

  @Input()
  public appointment: IAppointmentModel;

  @Input()
  public preview = false;

  @Input()
  public type: string;

  constructor(public urlService: UrlService, private snackBar: MatSnackBar, private router: Router,
              public sanitizer: DomSanitizer, @Inject(WINDOW) public window: Window) {
    if (!this.preview) {
      this.type = '';
    }
  }

  ngOnInit() {
  }

  copyInputMessage(inputElement: HTMLInputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    this.snackBar.open('Link kopiert', 'OK', {
      duration: 4000,
      panelClass: 'snackbar-default'
    });
  }

  redirectToAppointment(appointment: IAppointmentModel) {
    this.router.navigate(['/enroll'], {queryParams: {a: appointment.link}});
  }

}
