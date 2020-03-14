import {Component, OnInit} from '@angular/core';
import {IAppointmentModel} from '../../../models/IAppointment.model';
import {AppointmentService} from '../../../services/appointment.service';
import {Location} from '@angular/common';
import {IEnrollmentModel} from '../../../models/IEnrollment.model';
import {ActivatedRoute} from '@angular/router';
import {animate, query, state, style, transition, trigger} from '@angular/animations';
import {merge, Observable, Subject} from 'rxjs';
import {mapTo, mergeMap, skip, switchMap, take} from 'rxjs/operators';
import {SEOService} from '../../../_helper/_seo.service';

const HttpStatus = require('http-status-codes');

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss'],
  providers: [SEOService],
  animations: [
    trigger('fadeInOut', [
      state('in', style({opacity: 100})),
      transition('* => void', [
        animate(1000, style({opacity: 1})),
        animate(500, style({opacity: 0}))
      ])
    ]),
    trigger('remove', [
      transition('* => void', [
        query('.layer', [
          style({opacity: '1'}),
          animate(500, style({opacity: '0'}))
        ])
      ])
    ]),
  ]
})
export class DriverComponent implements OnInit {

  public appointment: IAppointmentModel = null;
  public data: MyType = {};
  public drivers: IEnrollmentModel[];
  public link;
  public percentDone: number;

  // CACHE
  appointment$: Observable<IAppointmentModel>;
  showNotification$: Observable<boolean>;
  update$ = new Subject<void>();
  forceReload$ = new Subject<void>();

  constructor(private appointmentService: AppointmentService, private location: Location, private route: ActivatedRoute,
              private _seoService: SEOService) {
    this.route.queryParams.subscribe(params => {
      this.link = params.a;
    });
  }

  async ngOnInit() {
    const initialAppointment$ = this.getDataOnce();

    const updates$ = merge(this.update$, this.forceReload$).pipe(
      mergeMap(() => this.getDataOnce())
    );

    this.appointment$ = merge(initialAppointment$, updates$);
    this.appointment$.subscribe(sAppointment => {
      this._seoService.updateTitle(`${sAppointment.title} - Fahrer`);
      this._seoService.updateDescription(sAppointment.title + ' - ' + sAppointment.description);

      this.appointment = sAppointment;
      const reload$ = this.forceReload$.pipe(switchMap(() => this.getNotifications()));
      const initialNotifications$ = this.getNotifications();
      const show$ = merge(initialNotifications$, reload$).pipe(mapTo(true));
      const hide$ = this.update$.pipe(mapTo(false));
      this.showNotification$ = merge(show$, hide$);

      this.sucessfulRequest();
    }, error => {
      this.appointment = undefined;
    });
  }

  getDataOnce() {
    return this.appointmentService.getAppointment(this.link, false).pipe(take(1));
  }

  getNotifications() {
    return this.appointmentService.getAppointment(this.link, false).pipe(skip(1));
  }

  forceReload() {
    this.appointmentService.forceReload();
    this.forceReload$.next();
  }

  private sucessfulRequest() {
    this.drivers = this.appointment.enrollments.filter(fAppointment => fAppointment.driver !== null);

    this.data.neededTo = this.appointment.enrollments.filter(fAppointment => {
      if (fAppointment.passenger != null
        && (fAppointment.passenger.requirement === 1 || fAppointment.passenger.requirement === 3)) {
        return fAppointment;
      }
    }).length;
    this.data.gotTo = 0;
    // tslint:disable-next-line:no-unused-expression
    this.appointment.enrollments.filter(fAppointment => {
      if (fAppointment.driver != null
        && (fAppointment.driver.service === 1 || fAppointment.driver.service === 3)) {
        this.data.gotTo += fAppointment.driver.seats;
      }
    }).length;
    this.data.neededFrom = this.appointment.enrollments.filter(fAppointment => {
      if (fAppointment.passenger != null
        && (fAppointment.passenger.requirement === 2 || fAppointment.passenger.requirement === 3)) {
        return fAppointment;
      }
    }).length;
    this.data.gotFrom = 0;
    // tslint:disable-next-line:no-unused-expression
    this.appointment.enrollments.filter(fAppointment => {
      if (fAppointment.driver != null
        && (fAppointment.driver.service === 2 || fAppointment.driver.service === 3)) {
        this.data.gotFrom += fAppointment.driver.seats;
      }
    }).length;
  }


  compare(nr1: number, nr2: number) {
    if (nr1 > nr2) {
      return 1;
    }

    if (nr1 === nr2) {
      return 0;
    }

    if (nr1 < nr2) {
      return -1;
    }
  }

  goBack() {
    this.location.back();
  }
}

interface MyType {
  [key: string]: number;
}
