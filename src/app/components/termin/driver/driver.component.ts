import { Component, OnDestroy, OnInit } from '@angular/core';
import { IAppointmentModel } from '../../../models/IAppointment.model';
import { Location } from '@angular/common';
import { IEnrollmentModel } from '../../../models/IEnrollment.model';
import { ActivatedRoute } from '@angular/router';
import { animate, query, state, style, transition, trigger } from '@angular/animations';
import { Observable, Subscription } from 'rxjs';
import { SEOService } from '../../../_helper/_seo.service';
import { AppointmentSocketioService } from '../../../services/appointment-socketio.service';
import { AppointmentProvider } from '../appointment.provider';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss'],
  providers: [SEOService],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 100 })),
      transition('* => void', [
        animate(1000, style({ opacity: 1 })),
        animate(500, style({ opacity: 0 }))
      ])
    ]),
    trigger('remove', [
      transition('* => void', [
        query('.layer', [
          style({ opacity: '1' }),
          animate(500, style({ opacity: '0' }))
        ])
      ])
    ]),
  ]
})
export class DriverComponent implements OnInit, OnDestroy {

  public appointment: IAppointmentModel = null;
  public data: MyType = {};
  public drivers: IEnrollmentModel[];
  public link;

  public appointment$: Observable<IAppointmentModel>;
  public loaded = true;

  private appointment$$: Subscription;

  constructor(private location: Location, private route: ActivatedRoute,
    private appointmentSocketioService: AppointmentSocketioService,
    private appointmentProvider: AppointmentProvider) {
    this.route.queryParams.subscribe(params => {
      this.link = params.a;
    });
  }

  async ngOnInit() {
    this.appointmentProvider.loadAppointment(this.link);

    if (!this.appointmentProvider.hasValue()) {
      this.loaded = false;
    }

    this.appointmentSocketioService
      .setupSocketConnection()
      .then(() => {
        this.appointmentSocketioService.subscribeToAppointmentUpdates(this.link);
      });

    this.loaded = false;
    this.appointment$ = this.appointmentProvider.appointment$;

    this.init();
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

  ngOnDestroy(): void {
    this.appointment$$.unsubscribe();
  }

  private init() {
    this.appointment$$ = this.appointment$
      .subscribe(sAppointment => {
        if (sAppointment === null) {
          this.loaded = true;
        } else if (sAppointment !== undefined) {
          sAppointment.enrollments = sAppointment.enrollments ? sAppointment.enrollments : [];
          this.drivers = sAppointment.enrollments.filter(fEnrollment => fEnrollment.driver);

          console.log(this.drivers);

          this.data.neededTo = sAppointment.enrollments.filter(fAppointment => {
            if (fAppointment.passenger != null
              && (fAppointment.passenger.requirement === 1 || fAppointment.passenger.requirement === 3)) {
              return fAppointment;
            }
          }).length;
          this.data.gotTo = 0;
          // tslint:disable-next-line:no-unused-expression
          sAppointment.enrollments.filter(fAppointment => {
            if (fAppointment.driver != null
              && (fAppointment.driver.service === 1 || fAppointment.driver.service === 3)) {
              this.data.gotTo += fAppointment.driver.seats;
            }
          }).length;
          this.data.neededFrom = sAppointment.enrollments.filter(fAppointment => {
            if (fAppointment.passenger != null
              && (fAppointment.passenger.requirement === 2 || fAppointment.passenger.requirement === 3)) {
              return fAppointment;
            }
          }).length;
          this.data.gotFrom = 0;
          // tslint:disable-next-line:no-unused-expression
          sAppointment.enrollments.filter(fAppointment => {
            if (fAppointment.driver != null
              && (fAppointment.driver.service === 2 || fAppointment.driver.service === 3)) {
              this.data.gotFrom += fAppointment.driver.seats;
            }
          }).length;

          this.loaded = true;
        }
      });
  }
}

interface MyType {
  [key: string]: number;
}
