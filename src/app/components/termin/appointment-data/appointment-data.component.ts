import {Component, Input, OnInit} from '@angular/core';
import {UrlService} from '../../../services/url.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-appointment-data',
  templateUrl: './appointment-data.component.html',
  styleUrls: ['./appointment-data.component.scss']
})
export class AppointmentDataComponent implements OnInit {

  @Input()
  private appointment;

  constructor(private urlService: UrlService, private snackBar: MatSnackBar) {
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
}
