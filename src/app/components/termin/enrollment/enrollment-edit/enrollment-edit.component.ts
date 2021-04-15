import {Component, EventEmitter, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IAppointmentModel} from '../../../../models/IAppointment.model';
import {IEnrollmentModel} from '../../../../models/IEnrollment.model';
import {EnrollmentModel} from '../../../../models/EnrollmentModel.model';
import {AuthenticationService} from '../../../../services/authentication.service';
import {EnrollmentMainFormComponent} from '../enrollment-main-form/enrollment-main-form.component';
import {ActivatedRoute, Router} from '@angular/router';
import {AppointmentUtil} from '../../../../_util/appointmentUtil.util';
import {Observable, Subscription} from 'rxjs';
import {AppointmentProvider} from '../../appointment.provider';
import {SEOService} from '../../../../_helper/_seo.service';
import {TokenUtil} from '../../../../_util/tokenUtil.util';
import {HttpErrorResponse} from '@angular/common/http';
import {EnrollmentService} from '../../../../services/enrollment.service';
import {MatSnackBar} from '@angular/material';

const HttpStatus = require('http-status-codes');

@Component({
  selector: 'app-enrollment-edit',
  templateUrl: './enrollment-edit.component.html',
  styleUrls: ['./enrollment-edit.component.scss']
})
export class EnrollmentEditComponent implements OnInit, OnDestroy {
  @ViewChild('mainForm', {static: true}) mainFormRef: EnrollmentMainFormComponent;

  public appointment$: Observable<IAppointmentModel>;
  public appointment: IAppointmentModel;
  public linkFromURL: string;
  public loaded = false;

  public userIsLoggedIn: boolean = this._authenticationService.userIsLoggedIn();
  public isEnrolledAsCreator: any;

  public enrollmentGone = false;

  public enrollment: IEnrollmentModel = new EnrollmentModel();
  public selectedIndex = 0;

  public sendingRequestEmit = new EventEmitter();

  // permission via mail
  public enrollmentId: string;
  public enrollmentPermissionToken: any;

  private appointment$$: Subscription;
  private appointmentService$$: Subscription;

  constructor(private _authenticationService: AuthenticationService, private _router: Router,
              private _route: ActivatedRoute, private _appointmentProvider: AppointmentProvider,
              private _seoService: SEOService, private _enrollmentService: EnrollmentService,
              private _snackBar: MatSnackBar) {
    this._route.queryParams.subscribe(params => {
      this.linkFromURL = params.a;
      this.enrollmentId = params.e;
      this.enrollmentPermissionToken = params.t;

      if (this.enrollmentPermissionToken) { // todo extra component?
        AppointmentUtil.storeEnrollmentPermissions(this.linkFromURL, {
          id: this.enrollmentId,
          token: this.enrollmentPermissionToken
        });
      }
    });

    this.appointment$ = this._appointmentProvider.appointment$;
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
          this._appointmentProvider.loadAppointment(this.linkFromURL);
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

  /**
   * MainFormComponent value emit listener.<br/>
   * Emits changed values to enrollment component.<br/>
   *
   * @param $event Object containing data from child
   */
  public mainFormDone($event: any) {
    const output = $event;
    output.id = this.enrollmentId;

    if (this.enrollment.creator) {
      delete output.name;
    }

    delete output.selfEnrollment;

    this.sendEnrollmentRequest(output);
  }

  /**
   * AdditionsComponent value emit listener.<br/>
   * Emits changed values to enrollment component.<br/>
   *
   * @param $event Object containing data from child
   */
  public additionsFormDone($event: any) {
    const output: any = {}; // IEnrollmentModel
    output.additions = $event;
    output.id = this.enrollmentId;

    this.sendEnrollmentRequest(output);
  }

  /**
   * DriverPassengerComponent value emit listener.<br/>
   * Emits changed values to enrollment component.<br/>
   *
   * @param $event Object containing data from child
   */
  public driverFormDone($event: any) {
    const output: any = {};

    output.id = this.enrollmentId;
    output.driver = $event.driver;
    output.passenger = $event.passenger;

    this.sendEnrollmentRequest(output);
  }

  /**
   * On cancel button click navigate back to appointment overview.
   */
  public cancel() {
    this._router.navigate(['/enroll'], {
      queryParams: {
        a: this.appointment.link
      }
    });
  }

  /**
   * Set error for used Input value.
   * e.G. Name <br/>
   * Call error setting function that manages function call of child component
   *
   * @param fColumn String Name of column that hase a duplicate value
   */
  public inUseError(fColumn: any) {
    const uppercaseName = fColumn.charAt(0).toUpperCase() + fColumn.substring(1);
    const fnName: string = 'set' + uppercaseName + 'Error';

    this[fnName]();
  }

  /**
   * Eventually send enrollment request, depending on edit or no edit;
   */
  public sendEnrollmentRequest(data) {
    setTimeout(() => { // needed so loading directive triggers again after login or sth
      this.sendingRequestEmit.emit(true);
    });

    // fetch permission token if existing
    data.token = TokenUtil.getTokenForEnrollment(this.enrollmentId, this.linkFromURL);

    this.appointmentService$$ = this._enrollmentService.update(data, this.appointment)
      .subscribe(
        result => {
          // this.appointment.enrollments.map((mEnrollment) => mEnrollment.id === data.id ? data : mEnrollment);
// TODO UPDATE ELEMENT ()

          this.request_success_finalize();
        }, (err: HttpErrorResponse) => {
          this.sendingRequestEmit.emit(false);

          if (err.status === HttpStatus.BAD_REQUEST) {
            if (err.error.code === 'DUPLICATE_ENTRY') {
              this.request_error_handleDuplicateValues(err);
            }
          } else if (err.status === HttpStatus.FORBIDDEN) {
            this.request_error_forbidden();
          }
        }
      );
  }

  /**
   * Pass Error to appropriate child component.<br/>
   * Calls name error function of component
   */
  // @ts-ignore // dynamic call
  private setNameError() {
    this.selectedIndex = 0;
    this.mainFormRef.setNameInUseError();
  }

  private main() {
    this.enrollment = this.appointment.enrollments.filter(fEnrollment => {
      return fEnrollment.id === this.enrollmentId;
    })[0];

    if (!this.enrollment) {
      this.enrollmentGone = true;
    }
  }

  private request_success_finalize() {
    this.redirect(`Erfolgreich bearbeitet`, false);
  }

  private request_error_forbidden() {
    this.redirect(`Sorry, du hast keine Berechtigung diesen Teilnehmer zu bearbeiten.`, true);
  }

  private redirect(message: string, error = false) {
    this._router.navigate([`enroll`], {queryParams: {a: this.appointment.link}})
      .then(() => {
        this.sendingRequestEmit.emit(false);

        this._snackBar
          .open(message,
            '',
            {
              duration: error ? 4000 : 2000,
              panelClass: `snackbar-${error ? 'error' : 'default'}`
            }
          );
      });
  }

  private request_error_handleDuplicateValues(err: HttpErrorResponse) {
    err.error.data.forEach(fColumn => {
      this.inUseError(fColumn);
    });
  }

  private __SEO() {
    this._seoService.updateTitle(`${this.appointment.title} - Anmelden`);
    this._seoService.updateDescription(this.appointment.title + ' - ' + this.appointment.description);
  }
}

