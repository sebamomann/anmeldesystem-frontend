import {Component, Inject} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {WINDOW} from '../provider/window.provider';
import {IUserModel} from '../models/IUserModel.model';
import {AuthenticationService} from '../services/authentication.service';
import {PwaService} from '../services/pwa-service.service';
import {PwaDialogComponent} from './dialogs/pwa-dialog/pwa-dialog.component';
import {MatDialog} from '@angular/material';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query('ul li', [
          style({opacity: 0, transform: 'scale(0.9)'}),
          stagger(75, [
            animate('0.15s', style({opacity: 1, transform: 'scale(1.05)'})),
            animate('0.075s', style({opacity: 1, transform: 'scale(1)'})),
          ])
        ])
      ])
    ])
  ]
})

export class AppComponent {
  public menu = false;
  public items: any[];
  public now: string;
  currentUser: IUserModel;
  private userIsLoggedIn: boolean = this.authenticationService.currentUserValue !== null;

  constructor(private router: Router, @Inject(WINDOW) private window: Window,
              private authenticationService: AuthenticationService, public pwa: PwaService, public dialog: MatDialog) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        (window as any).ga('set', 'page', event.urlAfterRedirects);
        (window as any).ga('send', 'pageview');
      }
    });

    this.pwa.checkForUpdates();

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

    this.buildNav();
  }

  public toggleMenu() {
    this.menu = !this.menu;
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

  buildNav() {
    this.items = [{name: 'dashboard', redirect: '/dashboard'}];

    if (this.userIsLoggedIn) {
      this.items.push({name: 'account', redirect: '/account'});
    }

    this.items.push({name: 'kontakt'});
    this.items.push({name: 'impressum'});
  }

  navigate(redirect: any) {
    this.router.navigate([redirect]).then(res => {
      const element: HTMLElement = document.getElementById('menuIcon') as HTMLElement;
      element.click();
    });
  }
}
