import {Component, NgModule, OnDestroy, OnInit} from '@angular/core';
import {IEnrollmentModel} from '../../models/IEnrollment.model';
import {IAppointmentModel} from '../../models/IAppointment.model';
import {ActivatedRoute, Router} from '@angular/router';
import {animate, query, stagger, state, style, transition, trigger} from '@angular/animations';
import {AuthenticationService} from '../../services/authentication.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {SEOService} from '../../_helper/_seo.service';
import {AppointmentSocketioService} from '../../services/appointment-socketio.service';
import {AppointmentProvider} from './appointment.provider';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss'],
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
    trigger('listAnimation', [
      transition('* => *', [
        query('mat-expansion-panel', [
          style({opacity: 0, transform: 'scale(0.9)'}),
          stagger(75, [
            animate('0.15s', style({opacity: 1, transform: 'scale(1.05)'})),
            animate('0.075s', style({opacity: 1, transform: 'scale(1)'})),
          ])
        ])
      ])
    ])
  ],
})
@NgModule({})
export class AppointmentComponent implements OnInit, OnDestroy {
  public link: string;

  public appointment$: Observable<IAppointmentModel>;
  public enrollments$: BehaviorSubject<IEnrollmentModel[]> = new BehaviorSubject<IEnrollmentModel[]>(undefined);
  public enrollmentsWaitingList$: BehaviorSubject<IEnrollmentModel[]> = new BehaviorSubject<IEnrollmentModel[]>(undefined);
  public enrollmentsLate$: BehaviorSubject<IEnrollmentModel[]> = new BehaviorSubject<IEnrollmentModel[]>(undefined);

  public limitReachedBeforeEnrollmentDeadline: boolean;

  public loaded = false;

  constructor(private route: ActivatedRoute, public router: Router, public authenticationService: AuthenticationService,
              private _seoService: SEOService, private appointmentSocketioService: AppointmentSocketioService,
              private appointmentProvider: AppointmentProvider) {
    this.route.queryParams.subscribe(params => {
      this.link = params.a;
    });

    this.route.params.subscribe(params => {
      if (params.link !== undefined) {
        this.link = params.link;
        this.router.navigate(['/enroll'], {queryParams: {a: this.link}}).then(() => '');
      }
    });
  }

  ngOnInit() {
    this.appointmentSocketioService
      .setupSocketConnection()
      .then(() => {
        this.appointmentSocketioService.subscribeAppointment(this.link);
      });

    this.appointment$ = this.appointmentProvider.appointment;

    this.listenForChange();
  }

  ngOnDestroy() {
  }

  public listenForChange() {
    this.appointment$
      .subscribe(
        (sAppointment) => {
          if (sAppointment === null) {
            this.loaded = true;
          } else if (sAppointment !== undefined) {
            this._seoService.updateTitle(`${sAppointment.title} - Anmeldesystem`);
            this._seoService.updateDescription(sAppointment.title + ' - ' + sAppointment.description);

            this.splitIntoParts(sAppointment);

            this.loaded = true;
          }
        });
  };

  private splitIntoParts(appointment: IAppointmentModel) {
    let enrollments_correct = [];
    let enrollments_waiting = [];
    let enrollments_late;

    // fetch enrollments that were created after the enrollment deadline
    enrollments_late = appointment.enrollments.filter(fEnrollment => {
      if (fEnrollment.iat > appointment.deadline) {
        return fEnrollment;
      } else {
        enrollments_correct.push(fEnrollment);
      }
    });

    if (appointment.maxEnrollments != null && appointment.maxEnrollments > 0) {
      if (enrollments_correct.length > appointment.maxEnrollments) {
        enrollments_correct = enrollments_correct
          .slice(0, appointment.maxEnrollments); // enrollments within the enrollment limit
        enrollments_waiting = enrollments_correct
          .slice(appointment.maxEnrollments, appointment.maxEnrollments + enrollments_correct.length); // enrollments on waiting list


        this.limitReachedBeforeEnrollmentDeadline = true;
      } else {
        enrollments_late = enrollments_late
          .slice(0, appointment.maxEnrollments); // enrollments after deadline
        enrollments_waiting = enrollments_late
          // tslint:disable-next-line:max-line-length
          .slice(appointment.maxEnrollments, appointment.maxEnrollments + enrollments_late.length); // enrollments after deadline on waiting list

        this.limitReachedBeforeEnrollmentDeadline = false;
      }
    }

    this.enrollments$.next(enrollments_correct);
    this.enrollmentsWaitingList$.next(enrollments_waiting);
    this.enrollmentsLate$.next(enrollments_late);
  }
}
