import {Component, EventEmitter, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from '../../../../services/authentication.service';
import {IEnrollmentModel} from '../../../../models/IEnrollment.model';
import {EnrollmentModel} from '../../../../models/EnrollmentModel.model';
import {IAppointmentModel} from '../../../../models/IAppointment.model';
import {MatSnackBar, MatStepper} from '@angular/material';
import {EnrollmentMainFormComponent} from '../enrollment-main-form/enrollment-main-form.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {AppointmentProvider} from '../../appointment.provider';
import {SEOService} from '../../../../_helper/_seo.service';
import {HttpErrorResponse} from '@angular/common/http';
import {AppointmentUtil} from '../../../../_util/appointmentUtil.util';
import {EnrollmentService} from '../../../../services/enrollment.service';
import {AuthenticationValuesService} from '../../../../services/authentication.values.service';

const HttpStatus = require('http-status-codes');

@Component({
  selector: 'app-enrollment-create',
  templateUrl: './enrollment-create.component.html',
  styleUrls: ['./enrollment-create.component.scss']
})
export class EnrollmentCreateComponent implements OnInit, OnDestroy {
  static LOCAL_STORAGE_ENROLLMENT_TMP_KEY = 'enrollmentOutput';

  @ViewChild('stepper', {static: false}) stepper: MatStepper;
  @ViewChild('mainForm', {static: false}) mainFormRef: EnrollmentMainFormComponent;

  public appointment$: Observable<IAppointmentModel>;
  public appointment: IAppointmentModel;
  public linkFromURL: string;
  public loaded = false;

  public userIsLoggedIn: boolean = this.authenticationService.userIsLoggedIn();
  public showLoginAndMailForm: boolean;

  public enrollmentOutput: IEnrollmentModel = new EnrollmentModel();

  public doneForms = {overall: false, additions: false, driver: false};

  public triggerDirectSend = false;
  public sendingRequestEmit = new EventEmitter();
  public directSend: boolean;

  public isEnrolledAsCreator: boolean;
  private creatorError: boolean;

  private appointment$$: Subscription;
  private appointmentService$$: Subscription;

  constructor(public authenticationService: AuthenticationService, private route: ActivatedRoute,
              private appointmentProvider: AppointmentProvider, private _seoService: SEOService,
              private enrollmentService: EnrollmentService, private snackBar: MatSnackBar,
              private router: Router, private authenticationValuesService: AuthenticationValuesService) {
    this.route.queryParams.subscribe(params => {
      this.linkFromURL = params.a;

      this.triggerDirectSend = params.send === 'true';
    });

    this.appointment$ = this.appointmentProvider.appointment$;
    this.appointment$$ = this.appointment$
      .subscribe((sAppointment) => {
        if (sAppointment !== undefined && !this.loaded) { // CAN BE NULL !!!
          this.appointment = sAppointment;
          this.loaded = true;
          this.main();

          if (this.appointment) {
            this.__SEO();
          }
        } else if (!this.loaded) {
          this.appointmentProvider.loadAppointment(this.linkFromURL);
        } else {
          // IGNORE FURTHER UPDATES
        }
      });
  }

  ngOnInit() {
  }

  public ngOnDestroy() {
    this.appointment$$.unsubscribe();

    if (this.appointmentService$$) {
      this.appointmentService$$.unsubscribe();
    }
  }

  public main() {
    if (this.userIsLoggedIn) {
      this.isEnrolledAsCreator = this.appointment.enrollments
        .some(
          sEnrollment => {
            return sEnrollment.creator
              && sEnrollment.creator.username === this.authenticationValuesService.currentUserSubject$.getValue().preferred_username;
          }
        );
      this.creatorError = this.isEnrolledAsCreator;
    }

    this.getEnrollmentFromLocalStorage();

    this.directSend = this.triggerDirectSend && this.userIsLoggedIn;

    if (this.triggerDirectSend && !this.creatorError) {
      this.initializeEnrollmentSend();
      this.stepper.selectedIndex = this.stepper.steps.length - 1;
      return;
    }
  }

  /**
   * Initialize sending of enrollment.<br/>
   * Information gathering and enrollment assigning (account or mail)
   */
  public initializeEnrollmentSend: () => void = () => {
    if (!this.enrollmentOutput.editMail
      && this.userIsLoggedIn
      && !this.isSelfEnrolling()
      && !this.triggerDirectSend) {
      this.showLoginAndMailForm = true;
      return;
    }

    if (this.isSelfEnrolling()) {
      delete this.enrollmentOutput.editMail;
    }

    this.clearLoginAndMailFormIntercepting();

    this.sendEnrollmentRequest();
  };

  public mailFormCancel() {
    this.clearLoginAndMailFormIntercepting();
    this.stepper.selectedIndex = this.stepper.steps.length - 2;
  }

  public mailFormSubmit($event: string) {
    this.enrollmentOutput.editMail = $event;
    this.enrollmentAssignmentDecision();
  }

  public isSelfEnrolling() {
    return this.enrollmentOutput.selfEnrollment;
  }

  public inUseError(fColumn: any) {
    const uppercaseName = fColumn.charAt(0).toUpperCase() + fColumn.substring(1);
    const fnName: string = 'set' + uppercaseName + 'Error';

    this[fnName]();
  }

  public setCreatorError() {
    this.mainFormRef.setCreatorError();
  }

  /**
   * Determine if data can be send to API directly. This is the case, if the user is already logged in.
   * Otherwise, the user is asked to login with his account, or send the enrollment with his mail (for auth purposes). <br/>
   * For the possible redirect to the login page, the data needs to be stored locally, to be fetched later.
   */
  public enrollmentAssignmentDecision() {
    // If user selected selfEnrollment
    // Or if mail is set, then send enrollment

    if (this.isSelfEnrolling()
      || this.enrollmentOutput.editMail) {
      this.stepper.selectedIndex = 0; // go back to main form

      this.initializeEnrollmentSend();
    } else {
      // not logged
      // tmp store item for possible login redirect
      localStorage.setItem(EnrollmentCreateComponent.LOCAL_STORAGE_ENROLLMENT_TMP_KEY, JSON.stringify(this.enrollmentOutput));

      this.showLoginAndMailForm = true;

      setTimeout(() => this.stepper.next());
    }
  }

  public mainFormDone($event: any) {
    this.doneForms.overall = true;

    this.enrollmentOutput = {...this.enrollmentOutput, ...$event};

    console.log(this.enrollmentOutput);

    setTimeout(() => this.stepper.next());
  }

  public additionsFormDone(val) {
    this.enrollmentOutput.additions = val;

    setTimeout(() => this.stepper.next());
  }

  public driverFormDone($event) {
    this.doneForms.driver = true;

    this.enrollmentOutput = {...this.enrollmentOutput, ...$event};

    setTimeout(() => this.stepper.next());
  }

  public stepperPrevious() {
    this.stepper.previous();
  }

  /**
   * Eventually send enrollment request, depending on edit or no edit;
   */
  public sendEnrollmentRequest() {
    const enrollment = this.enrollmentOutput;

    setTimeout(() => { // needed so loading directive triggers again after login or sth
      this.sendingRequestEmit.emit(true);
    });

    this.appointmentService$$ = this.enrollmentService.create(enrollment, this.appointment)
      .subscribe(
        result => {
          this.appointment.enrollments.push(result);
          this.appointmentProvider.update(this.appointment);

          if (result.token) {
            AppointmentUtil.storeEnrollmentPermissions(this.linkFromURL, {id: result.id, token: result.token});
          }

          this.request_success_finalize();
        }, (err: HttpErrorResponse) => {
          this.sendingRequestEmit.emit(false);

          if (err.status === HttpStatus.BAD_REQUEST && err.error.code === 'DUPLICATE_ENTRY') {
            this.request_error_handleDuplicateValues(err);
          }
        }
      );
  }

  private clearLoginAndMailFormIntercepting() {
    localStorage.removeItem(EnrollmentCreateComponent.LOCAL_STORAGE_ENROLLMENT_TMP_KEY);
    this.showLoginAndMailForm = false;
  }

  // @ts-ignore // dynamic call
  private setNameError() {
    this.stepper.selectedIndex = 0;
    this.mainFormRef.setNameInUseError();
  }

  private getEnrollmentFromLocalStorage() {
    // Fetch output from localStorage
    this.enrollmentOutput = JSON.parse(localStorage.getItem(EnrollmentCreateComponent.LOCAL_STORAGE_ENROLLMENT_TMP_KEY));

    if (!this.enrollmentOutput) {
      this.enrollmentOutput = new EnrollmentModel();
    }
  }

  private request_error_handleDuplicateValues(err: HttpErrorResponse) {
    err.error.data.forEach(fColumn => {
      if (fColumn === 'creator') {
        this.setCreatorError();
      } else {
        this.inUseError(fColumn);
      }
    });
  }

  private __SEO() {
    this._seoService.updateTitle(`${this.appointment.title} - Anmelden`);
    this._seoService.updateDescription(this.appointment.title + ' - ' + this.appointment.description);
  }

  private request_success_finalize() {
    this.redirect(`Erfolgreich angemeldet`, false);
  }

  private redirect(message: string, error = false) {
    this.router.navigate([`enroll`], {queryParams: {a: this.appointment.link}})
      .then(() => {
        this.sendingRequestEmit.emit(false);

        this.snackBar
          .open(message,
            '',
            {
              duration: error ? 4000 : 2000,
              panelClass: `snackbar-${error ? 'error' : 'default'}`
            }
          );
      });
  }
}
