import {Component, Inject} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {WINDOW} from '../provider/window.provider';
import {IUserModel} from '../models/IUserModel.model';
import {AuthenticationService} from '../services/authentication.service';
import {PwaService} from '../services/pwa-service.service';
import {PwaDialogComponent} from './dialogs/pwa-dialog/pwa-dialog.component';
import {MatDialog} from '@angular/material';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';

const version = require('../../../package.json').version;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query('ul li', [
          style({opacity: 0, transform: 'scale(0.9)'}),
          stagger(50, [
            animate('0.2s 150ms', style({opacity: 1, transform: 'scale(1.05)'})),
            animate('0.05s', style({opacity: 1, transform: 'scale(1)'})),
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
  public currentUser: IUserModel;
  private userIsLoggedIn: boolean = this.authenticationService.currentUserValue !== null;
  public version: string = version;

  constructor(private router: Router, @Inject(WINDOW) private window: Window,
              private authenticationService: AuthenticationService, public pwa: PwaService, public dialog: MatDialog) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        (window as any).ga('set', 'page', event.urlAfterRedirects);
        (window as any).ga('send', 'pageview');
      }
    });

    if (this.authenticationService.currentUserValue !== null
      && this.authenticationService.currentUserValue.exp !== undefined
      && this.authenticationService.currentUserValue.exp !== null) {
      this.authenticationService.logout();
    }

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
    this.items = [];

    const group1 = [];
    group1.push({name: 'dashboard', redirect: '/dashboard'});

    if (this.authenticationService.userIsLoggedIn()) {
      group1.push({name: 'account', redirect: '/account'});
    } else {
      group1.push({name: 'login', redirect: '/account/login'}); //
    }

    const group2 = [];
    group2.push({name: 'releasenotes', redirect: '/release'});
    group2.push({name: 'support', redirect: '/support'});

    const group3 = [];
    group3.push({name: 'kontakt'});
    group3.push({name: 'impressum'});

    this.items.push(group1, group2, group3);
  }

  navigate(redirect: any) {
    this.router.navigate([redirect]).then(res => {
      const element: HTMLElement = document.getElementById('menuIcon') as HTMLElement;
      element.click();
    });
  }
}
