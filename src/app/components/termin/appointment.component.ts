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
import {SettingsService} from '../../services/settings.service';
import {AppointmentService} from '../../services/appointment.service';
import {AppointmentUtil} from '../../_util/appointmentUtil.util';
import {MatSnackBar} from '@angular/material';

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

  public loaded = true;
  public hasEnrollments = false;

  // WEBSOCKET CONNECTION
  public websocketSubscriptionEstablished = false;
  public websocketSubscriptionRetryCount = 0;
  public hideWebsocketSubscriptionInformation = false;

  // WEBSOCKET AUTOLOAD
  public hasUpdate = false;
  public updateOnWsCallDefined = false;
  public showEnrollmentHint = false;
  public showEnrollmentHintForceHide = false;
  private manualAppointmentReloadCount = 0;

  constructor(private route: ActivatedRoute, public router: Router, public authenticationService: AuthenticationService,
              private _seoService: SEOService, private appointmentSocketioService: AppointmentSocketioService,
              private appointmentProvider: AppointmentProvider, public settingsService: SettingsService,
              private appointmentService: AppointmentService, private snackBar: MatSnackBar) {
    this.route.queryParams.subscribe(params => {
      this.link = params.a;
    });

    this.route.params.subscribe(params => {
      if (params.link !== undefined) {
        this.link = params.link;
        this.router.navigate(['/enroll'], {queryParams: {a: this.link}}).then(() => '');
      }
    });

    this.updateOnWsCallDefined = this.settingsService.autoLoadOnWsCallIsDefined;
    if (!this.updateOnWsCallDefined) {
      this.settingsService.autoLoadOnWsCall = true;
    }
  }

  async ngOnInit() {
    if (!this.appointmentProvider.hasValue()) {
      this.loaded = false;
    }

    this.appointmentSocketioService
      .hasUpdate$
      .subscribe((bool: boolean) => {
        this.hasUpdate = bool;
      });

    this.appointmentSocketioService
      .websocketSubscriptionValid$
      .subscribe((bool: boolean) => {
        this.websocketSubscriptionEstablished = bool;
      });

    this.appointmentSocketioService
      .websocketSubscriptionRetryCount$
      .subscribe((val: number) => {
        this.websocketSubscriptionRetryCount = val;
      });

    this.appointmentSocketioService
      .setupSocketConnection()
      .then(() => {
        this.loaded = false;

        this.appointmentSocketioService.subscribeToAppointmentUpdates(this.link);
        this.appointment$ = this.appointmentProvider.appointment$;

        this.listenForChange();
      });
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
            this.link = sAppointment.link;

            // TODO could be cleaner ...
            if (sAppointment.reference.indexOf('ENROLLED') === -1
              && sAppointment.reference.indexOf('CREATOR') === -1
              && sAppointment.reference.indexOf('ADMIN') === -1
              && !this.showEnrollmentHintForceHide
              && !this.appointmentService.hasCloseEnrollmentHint(this.link)) {
              setTimeout(() => {
                this.showEnrollmentHint = true;
              }, 2000);
            }


            if (sAppointment.reference.indexOf('PINNED') === -1
              && this.settingsService.autoPinAppointment) {
              AppointmentUtil.pin(sAppointment.link);
              if (this.authenticationService.userIsLoggedIn()) {
                this.appointmentService
                  .pin(sAppointment.link)
                  .toPromise()
                  .then(() => {
                  });
              }

              sAppointment.reference.push('PINNED');

              this.snackBar.open('Angepinnt',
                '',
                {
                  duration: 2000,
                  panelClass: 'snackbar-default'
                });
            }

            this._seoService.updateTitle(`${sAppointment.title} | GJM - Anmeldesystem`);
            this._seoService.updateDescription(sAppointment.title + ' - ' + sAppointment.description);

            this.splitEnrollments(sAppointment);

            this.loaded = true;
          }
        });
  };

  public reload(link) {
    this.manualAppointmentReloadCount++;
    if (this.manualAppointmentReloadCount >= 3) {
      this.updateOnWsCallDefined = false;
    }
    this.appointmentSocketioService.reload(link);
  }

  public retryWebsocketSubscription(link: string) {
    this.websocketSubscriptionRetryCount = 0;  // directly set to 0 because behaviour subjects need some time ... -> instant feedback
    this.appointmentSocketioService.retrySubscription(link);
  }

  public closeEnrollmentHint() {
    this.showEnrollmentHint = false;
    this.showEnrollmentHintForceHide = true;
    this.appointmentService.closeEnrollmentHint(this.link);
  }

  private splitEnrollments(appointment: IAppointmentModel) {
    let enrollments_correct = [];
    let enrollments_waiting = [];
    let enrollments_late;

    appointment.enrollments.sort((a, b) => {
      return a.iat > b.iat ? 1 : -1;
    });

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
        const _enrollments_correct = enrollments_correct
          .slice(0, appointment.maxEnrollments); // enrollments within the enrollment limit
        enrollments_waiting = enrollments_correct
          .slice(appointment.maxEnrollments, appointment.maxEnrollments + _enrollments_correct.length); // enrollments on waiting list

        enrollments_correct = _enrollments_correct;

        this.limitReachedBeforeEnrollmentDeadline = true;
      } else {
        const _enrollments_late = enrollments_late
          .slice(0, appointment.maxEnrollments); // enrollments after deadline
        enrollments_waiting = enrollments_late
          // tslint:disable-next-line:max-line-length
          .slice(appointment.maxEnrollments, appointment.maxEnrollments + _enrollments_late.length); // enrollments after deadline on waiting list

        enrollments_late = _enrollments_late;

        this.limitReachedBeforeEnrollmentDeadline = false;
      }
    }

    this.hasEnrollments = enrollments_correct.length + enrollments_waiting.length + enrollments_late.length > 0;

    this.enrollments$.next(enrollments_correct);
    this.enrollmentsWaitingList$.next(enrollments_waiting);
    this.enrollmentsLate$.next(enrollments_late);
  }
}
