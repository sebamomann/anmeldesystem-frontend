import {Component, Inject} from '@angular/core';
import {Router} from '@angular/router';
import {WINDOW} from '../provider/window.provider';
import {IUserModel} from '../models/IUserModel.model';
import {AuthenticationService} from '../services/authentication.service';
import {PwaService} from '../services/pwa-service.service';
import {PwaDialogComponent} from './dialogs/pwa-dialog/pwa-dialog.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  public now: string;
  currentUser: IUserModel;

  constructor(private router: Router, @Inject(WINDOW) private window: Window,
              private authenticationService: AuthenticationService, public pwa: PwaService, public dialog: MatDialog) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const date = new Date();
    this.now = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

    particlesJS.load('particles-js', './assets/particlesjs-config.json', null);

    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

    if (pwa.promptEvent) {
      this.openPwaDialog();
    }
  }

  public openPwaDialog: () => void = () => {
    const dialogRef = this.dialog.open(PwaDialogComponent, {
      width: '75%',
      maxWidth: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  };

  getHostname(): string {
    return this.window.location.hostname;
  }
}
