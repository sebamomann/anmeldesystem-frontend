import {Component} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {IUserModel} from '../models/IUserModel.model';
import {AuthenticationService} from '../services/authentication.service';
import {PwaDialogComponent} from './dialogs/pwa-dialog/pwa-dialog.component';
import {MatDialog} from '@angular/material';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';
import {MonthnamePipe} from '../pipes/monthname.pipe';
import {LoadingService} from '../services/loading.service';

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
    ]),
    trigger('remove', [
      transition('* => void', [
        query('.hexagon-wrapper', [
          style({opacity: '1'}),
          animate('0.05s 150ms', style({transform: 'scale(1.05) rotate(60deg)', opacity: 1})),
          animate('0.2s', style({transform: 'scale(0.9)', opacity: '0'})),
        ]),
        query(':self', [
          style({opacity: '1'}),
          animate(500, style({opacity: '0'}))
        ])
      ])
    ]),
    trigger('appear', [
      transition('void => *', [
        query('.hexagon-wrapper', [
          style({opacity: 0, transform: 'scale(0.9)'}),
          animate('0.2s 150ms', style({opacity: 1, transform: 'scale(1.05)'})),
          animate('0.05s', style({opacity: 1, transform: 'scale(1)'})),
        ])
      ])
    ]),
  ]
})

export class AppComponent {
  public menu = false;
  public items: any[];
  public now: string;
  public currentUser: IUserModel;
  public version: string = version;

  constructor(private router: Router,
              private authenticationService: AuthenticationService, public dialog: MatDialog,
              private monthnamePipe: MonthnamePipe, private loadingService: LoadingService) {
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

    const date = new Date();
    this.now = `${this.monthnamePipe.transform(date.getMonth())} ${date.getFullYear()}`;

    particlesJS.load('particles-js', './assets/particlesjs-config.json', null);

    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

    this.buildNav();

    this.authenticationService
      .refreshing$
      .subscribe((val) => {
        if (val) {
          this.loadingService.messageSec = 'Deine Authentifizierung wird automatisch erneuert. Das kann einen Moment dauern.';
        } else {
          this.loadingService.messageSec = undefined;
        }
      });
  }

  public toggleMenu() {
    this.menu = !this.menu;
  }

  public openPwaDialog: () => void = () => {
    const dialogRef = this.dialog.open(PwaDialogComponent, {
      width: '90%',
      maxWidth: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  };

  buildNav() {
    this.items = [];

    const group1 = [];
    group1.push({name: 'dashboard', redirect: '/dashboard'});

    this.authenticationService
      .loginStatus$
      .subscribe((val) => {
        const toRemove = group1.find((fGroup) => fGroup.name === 'account' || fGroup.name === 'login');
        const index = group1.indexOf(toRemove);
        if (index !== -1) {
          group1.splice(index, 1);
        }

        if (val) {
          group1.push({name: 'account', redirect: '/account'});
        } else {
          group1.push({name: 'login', redirect: '/account/login'}); //
        }
      });

    const group2 = [];
    group2.push({name: 'releasenotes', redirect: '/release'});
    group2.push({name: 'support', redirect: '/support'});

    const group3 = [];
    group3.push({name: 'einstellungen', redirect: '/settings'});


    const group4 = [];
    group4.push({name: 'kontakt'});
    group4.push({name: 'impressum'});

    this.items.push(group1, group2, group3, group4);
  }

  navigate(redirect: any) {
    this.router.navigate([redirect]).then(res => {
      const element: HTMLElement = document.getElementById('menuIcon') as HTMLElement;
      element.click();
    });
  }
}
