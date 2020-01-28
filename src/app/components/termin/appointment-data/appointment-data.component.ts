import {Component, Inject, Input, OnInit} from '@angular/core';
import {UrlService} from '../../../services/url.service';
import {MatSnackBar} from '@angular/material';
import {IAppointmentModel} from '../../../models/IAppointment.model';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {WINDOW} from '../../../provider/window.provider';

@Component({
  selector: 'app-appointment-data',
  templateUrl: './appointment-data.component.html',
  styleUrls: ['./appointment-data.component.scss'],
})
export class AppointmentDataComponent implements OnInit {

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

  getBlob(base64: string) {
    return new Blob([base64]);
  }

  arrayBufferToBase64(buffer) {
    const TYPED_ARRAY = new Uint8Array(buffer.data);
    const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
      return data + String.fromCharCode(byte);
    }, '');
    return STRING_CHAR;
  }


  redirectToAppointment(appointment: IAppointmentModel) {
    this.router.navigate(['/enroll'], {queryParams: {a: appointment.link}});
  }

  b64toBlob(base64, type = 'application/octet-stream') {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    // tslint:disable-next-line:prefer-const
    let byteString = atob(base64.split(',')[1]);

    // separate out the mime component
    // tslint:disable-next-line:prefer-const
    let mimeString = base64.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    // tslint:disable-next-line:prefer-const
    return new Blob([ab]);
  }
}
