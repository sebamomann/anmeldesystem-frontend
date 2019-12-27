import {Component, Input, OnInit} from '@angular/core';
import {UrlService} from '../../../services/url.service';
import {MatSnackBar} from '@angular/material';
import {IAppointmentModel} from '../../../models/IAppointment.model';
import {Router} from '@angular/router';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-appointment-data',
  templateUrl: './appointment-data.component.html',
  styleUrls: ['./appointment-data.component.scss']
})
export class AppointmentDataComponent implements OnInit {

  @Input()
  public appointment;

  @Input()
  public preview = false;

  constructor(public urlService: UrlService, private snackBar: MatSnackBar, private router: Router) {
  }

  ngOnInit() {
  }

  copyInputMessage(inputElement: HTMLInputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    this.snackBar.open('Link kopiert', 'OK', {
      duration: 3000,
      panelClass: 'snackbar-default'
    });
  }


  redirectToAppointment(appointment: IAppointmentModel) {
    this.router.navigate(['/enroll'], {queryParams: {val: appointment.link}});
  }

  downloadFile() {
    this.appointment.files.forEach(file => {
      saveAs(file, 'file.pdf');
    });
  }
}
