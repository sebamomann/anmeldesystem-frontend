import {Component, NgModule, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IEnrollmentModel} from '../../models/IEnrollment.model';
import {IAppointmentModel} from '../../models/IAppointment.model';
import {ActivatedRoute, Router} from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AuthenticationService} from '../../services/authentication.service';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {SEOService} from '../../_helper/_seo.service';
import {AppointmentSocketioService} from '../../services/appointment-socketio.service';
import {AppointmentProvider} from './appointment.provider';
import {SettingsService} from '../../services/settings.service';
import {AppointmentService} from '../../services/appointment.service';
import {AppointmentUtil} from '../../_util/appointmentUtil.util';
import {MatSnackBar} from '@angular/material';
import {AppointmentStatus} from './appointment.status';
import {EnrollmentListComponent} from './enrollment/enrollment-list/enrollment-list.component';
import {EnrollmentModel} from '../../models/EnrollmentModel.model';
import {LoadingService} from '../../services/loading.service';
import {DomSanitizer} from '@angular/platform-browser';

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
  ],
})
@NgModule({})
export class AppointmentComponent implements OnInit, OnDestroy {
  @ViewChild('enrollments_actual', {static: false}) enrollments_actualRef: EnrollmentListComponent;
  @ViewChild('enrollments_waiting', {static: false}) enrollments_waitingRef: EnrollmentListComponent;
  @ViewChild('enrollments_late', {static: false}) enrollments_lateRef: EnrollmentListComponent;

  public link: string;

  public appointment$: Observable<IAppointmentModel>;
  // splitted enrollments
  public enrollments$: BehaviorSubject<IEnrollmentModel[]> = new BehaviorSubject<IEnrollmentModel[]>(undefined);
  public enrollmentsWaitingList$: BehaviorSubject<IEnrollmentModel[]> = new BehaviorSubject<IEnrollmentModel[]>(undefined);
  public enrollmentsLate$: BehaviorSubject<IEnrollmentModel[]> = new BehaviorSubject<IEnrollmentModel[]>(undefined);
  // calculated enrollment numbers
  public enrollmentNr: number;
  public enrollmentNrWaiting: number;
  public enrollmentNrLate: number;

  public limitReachedBeforeEnrollmentDeadline: boolean;

  public loaded = false;
  public hasEnrollments = false;

  // WEBSOCKET CONNECTION
  public websocketSubscriptionEstablished = false;
  public websocketSubscriptionRetryCount = 0;
  public hideWebsocketSubscriptionInformation = false;

  // WEBSOCKET AUTOLOAD
  public hasAppointmentUpdate = false;
  public updateOnWsCallSettingDefined = false;
  public showEnrollmentHint = false;
  public showEnrollmentHintForceHide = false;
  public updatingAppointmentInBackground = false;

  public showAdditions = true;
  private manualAppointmentReloadCount = 0;
  private hasUpdate$$: Subscription;
  private updating$$: Subscription;
  private websocketSubscriptionValid$$: Subscription;
  private websocketSubscriptionRetryCount$$: Subscription;
  private appointment$$: Subscription;
  private editId: string;
  private editOperation: string;

  constructor(private route: ActivatedRoute, public router: Router, public authenticationService: AuthenticationService,
              private _seoService: SEOService, private appointmentSocketioService: AppointmentSocketioService,
              private appointmentProvider: AppointmentProvider, public settingsService: SettingsService,
              private appointmentService: AppointmentService, private snackBar: MatSnackBar, private appointmentStatus: AppointmentStatus,
              private loadingService: LoadingService, public sanitizer: DomSanitizer) {
    this.loadingService.message = '';

    this.route.queryParams.subscribe(params => {
      this.link = params.a;
      this.editId = params.editId;
      this.editOperation = params.operation;
    });

    this.route.params.subscribe(params => {
      if (params.link !== undefined) {
        this.link = params.link;
        this.router.navigate(['/enroll'], {queryParams: {a: this.link}}).then(() => ''); // convert link to query parameter
      }
    });

    this.updateOnWsCallSettingDefined = this.settingsService.autoLoadOnWsCallIsDefined;
    if (!this.updateOnWsCallSettingDefined) {
      this.settingsService.autoLoadOnWsCall = true;
    }
  }

  async ngOnInit() {
    this.appointmentProvider.loadAppointment(this.link);

    this.hasUpdate$$ = this.appointmentSocketioService
      .hasUpdate$
      .subscribe((bool: boolean) => {
        this.hasAppointmentUpdate = bool;
      });

    this.updating$$ = this.appointmentStatus
      .updating$
      .subscribe((bool: boolean) => {
        this.updatingAppointmentInBackground = bool;
      });

    this.websocketSubscriptionValid$$ = this.appointmentSocketioService
      .websocketSubscriptionValid$
      .subscribe((bool: boolean) => {
        this.websocketSubscriptionEstablished = bool;
      });

    this.websocketSubscriptionRetryCount$$ = this.appointmentSocketioService
      .websocketSubscriptionRetryCount$
      .subscribe((val: number) => {
        this.websocketSubscriptionRetryCount = val;
      });

    this.appointmentSocketioService
      .setupSocketConnection()
      .then(() => {
        this.appointmentSocketioService.subscribeToAppointmentUpdates('' + this.link);
      });

    this.appointment$ = this.appointmentProvider.appointment$;

    this.listenForChange();
  }

  ngOnDestroy() {
    this.hasUpdate$$.unsubscribe();
    this.updating$$.unsubscribe();
    this.websocketSubscriptionValid$$.unsubscribe();
    this.websocketSubscriptionRetryCount$$.unsubscribe();

    this.appointment$$.unsubscribe();
  }

  public listenForChange() {
    this.appointment$$ = this.appointment$
      .subscribe(
        (sAppointment) => {
          if (sAppointment === null) {
            this.loaded = true;
            this.loadingService.message = undefined;
          } else if (sAppointment !== undefined) {
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


            if ((sAppointment.reference.indexOf('PINNED') === -1 && !AppointmentUtil.isPinned(this.link))
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
            this.loadingService.message = undefined;
          } else {
            this.loadingService.message = '';
            this.loaded = false;
          }
        });
  };

  /**
   * Reload appointment (called by UI -> manual reload)
   * If user clicked this button 3 times, prompt him to activate automatic reload.<br/>
   * Also set has update to false, so the UI is not showing it.
   */
  public manualReload() {
    this.manualAppointmentReloadCount++;
    if (this.manualAppointmentReloadCount >= 3) {
      this.updateOnWsCallSettingDefined = false;
    }

    this.appointmentSocketioService.reload(this.link);
  }

  public retryWebsocketSubscription() {
    this.websocketSubscriptionRetryCount = 0;  // directly set to 0 because behaviour subjects need some time ... -> instant feedback
    this.appointmentSocketioService.reactivateWebsocketConnection();
  }

  public closeEnrollmentHint() {
    this.showEnrollmentHint = false;
    this.showEnrollmentHintForceHide = true;
    this.appointmentService.closeEnrollmentHint(this.link);
  }

  public toggleShowAdditions() {
    this.showAdditions = !this.showAdditions;
  }

  scroll(val: string) {
    const el = document.getElementById(val);
    el.scrollIntoView({behavior: 'smooth'});
  }

  tableCount() {
    let count = 0;
    [this.enrollmentNr, this.enrollmentNrLate, this.enrollmentNrWaiting].forEach((item) => {
      if (item > 0) {
        count++;
      }
    });
    return count;
  }

  login() {
    this.authenticationService.login();
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
          .slice(appointment.maxEnrollments, appointment.maxEnrollments + enrollments_correct.length); // enrollments on waiting list

        enrollments_correct = _enrollments_correct;

        this.limitReachedBeforeEnrollmentDeadline = true;
      } else {
        const _enrollments_late = enrollments_late
          .slice(0, appointment.maxEnrollments); // enrollments after deadline
        enrollments_waiting = enrollments_late
          // tslint:disable-next-line:max-line-length
          .slice(appointment.maxEnrollments, appointment.maxEnrollments + enrollments_late.length); // enrollments after deadline on waiting list

        enrollments_late = _enrollments_late;

        this.limitReachedBeforeEnrollmentDeadline = false;
      }
    }

    this.hasEnrollments = enrollments_correct.length + enrollments_waiting.length + enrollments_late.length > 0;

    this.enrollments$.next(enrollments_correct);
    this.enrollmentNr = enrollments_correct.length;
    this.enrollmentsWaitingList$.next(enrollments_waiting);
    this.enrollmentNrWaiting = enrollments_waiting.length;
    this.enrollmentsLate$.next(enrollments_late);
    this.enrollmentNrLate = enrollments_late.length;

    setTimeout(() => {
      if (this.editId && this.editOperation) {
        let enr;
        enr = enrollments_correct.find((sEnrollment) => sEnrollment.id === this.editId);
        if (enr) {
          const enrollment = new EnrollmentModel();
          enrollment.id = this.editId;
          enrollment.name = enr.name;
          this.enrollments_actualRef.preCheckOpenConfirmationDialog(enrollment, this.editOperation);
          return;
        }

        enr = enrollments_late.find((sEnrollment) => sEnrollment.id === this.editId);
        if (enr) {
          const enrollment = new EnrollmentModel();
          enrollment.id = this.editId;
          enrollment.name = enr.name;
          this.enrollments_lateRef.preCheckOpenConfirmationDialog(enrollment, this.editOperation);
          return;
        }

        enr = enrollments_waiting.find((sEnrollment) => sEnrollment.id === this.editId);
        if (enr) {
          const enrollment = new EnrollmentModel();
          enrollment.id = this.editId;
          enrollment.name = enr.name;
          this.enrollments_waitingRef.preCheckOpenConfirmationDialog(enrollment, this.editOperation);
          return;
        }
      }
    });
  }
}
