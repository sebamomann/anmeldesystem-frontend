import {Component} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {IUserModel} from '../models/IUserModel.model';
import {MatDialog} from '@angular/material';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';
import {MonthnamePipe} from '../pipes/monthname.pipe';
import {AuthenticationValuesService} from '../services/authentication.values.service';
import {interval} from 'rxjs';
import {UpdateService} from '../services/update.service';

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
              public dialog: MatDialog,
              private monthnamePipe: MonthnamePipe,
              private authenticationValuesService: AuthenticationValuesService,
              private update: UpdateService) {
    const source = interval(1000 * 60);

    source.subscribe(
      () => {
        this.update.checkForUpdate();
      }
    );

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        (window as any).ga('set', 'page', event.urlAfterRedirects);
        (window as any).ga('send', 'pageview');
      }
    });

    const date = new Date();
    this.now = `${this.monthnamePipe.transform(date.getMonth())} ${date.getFullYear()}`;

    particlesJS.load('particles-js', './assets/particlesjs-config.json', null);

    this.buildNav();
  }

  public toggleMenu() {
    this.menu = !this.menu;
  }

  buildNav() {
    this.items = [];

    const group1 = [];
    group1.push({name: 'dashboard', redirect: '/dashboard'});

    this.authenticationValuesService
      .loginStatus$
      .subscribe((val) => {
        const toRemove = group1.find((fGroup) => fGroup.name === 'account' || fGroup.name === 'login');
        const index = group1.indexOf(toRemove);
        if (index !== -1) {
          group1.splice(index, 1);
        }

        if (val) {
          group1.push({name: 'account', redirect: '/account/profile'});
        } else {
          group1.push({name: 'login', redirect: '/account/login'});
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
