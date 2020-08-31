import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {IAdditionModel} from '../../../models/IAddition.model';
import {IAppointmentModel} from '../../../models/IAppointment.model';
import {HttpErrorResponse, HttpEventType} from '@angular/common/http';
import {animate, query, state, style, transition, trigger} from '@angular/animations';
import {AuthenticationService} from '../../../services/authentication.service';
import {MatSnackBar} from '@angular/material';
import {IEnrollmentModel} from '../../../models/IEnrollment.model';
import {EnrollmentService} from '../../../services/enrollment.service';
import {EnrollmentModel} from '../../../models/EnrollmentModel.model';
import {Observable, Subscription} from 'rxjs';
import {TokenUtil} from '../../../_util/tokenUtil.util';
import {SEOService} from '../../../_helper/_seo.service';
import {AppointmentSocketioService} from '../../../services/appointment-socketio.service';
import {AppointmentProvider} from '../appointment.provider';
import {AppointmentUtil} from '../../../_util/appointmentUtil.util';

const HttpStatus = require('http-status-codes');

@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.scss'],
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
export class EnrollmentComponent implements OnInit, OnDestroy {
  private static LOCAL_STORAGE_ENROLLMENT_TMP_KEY = 'enrollmentOutput';

  public userIsLoggedIn: boolean = this.authenticationService.userIsLoggedIn();

  public appointmentLink: string;
  public appointment: IAppointmentModel;
  public isEdit: any;
  public enrollmentGone = false;
  public sendingRequestEmit = new EventEmitter<boolean>();

  public loaded = false;
  public showLoginAndMailForm = false;

  public appointment$: Observable<IAppointmentModel>;

  public form_main = this.formBuilder.group({
    name: new FormControl('', [Validators.required, Validators.min(2)]),
    comment: new FormControl('', [Validators.min(2)]),
    additions: new FormArray([]),
  });

  public form_selfEnrollment = this.formBuilder.group({
    selfEnrollment: new FormControl('true', []),
  });

  public form_driverPassenger = this.formBuilder.group({
    driver: new FormControl(false),
    seats: new FormControl('', [Validators.min(1)]),
    requirement: new FormControl('', []),
    service: new FormControl('', [])
  });

  // Preparation for login redirect fields
  private finalEnrollment_raw: string;
  private finalEnrollment: IEnrollmentModel = new EnrollmentModel();
  // Sending options
  private triggerDirectSend = false;
  // permission via mail
  private permissionToken: any;
  private enrollmentId: string;

  private appointment$$: Subscription;
  private appointmentService$$: Subscription;

  constructor(private enrollmentService: EnrollmentService,
              private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router,
              private authenticationService: AuthenticationService, private snackBar: MatSnackBar,
              private _seoService: SEOService, private appointmentSocketioService: AppointmentSocketioService,
              private appointmentProvider: AppointmentProvider) {
    this.route.queryParams.subscribe(params => {
      this.appointmentLink = params.a;
      this.enrollmentId = params.e;
      this.permissionToken = params.t;

      this.triggerDirectSend = params.send === 'true';

      if (this.permissionToken) {
        AppointmentUtil.storeEnrollmentPermissions(this.appointmentLink, {
          id: this.enrollmentId,
          token: this.permissionToken
        });
      }
    });
  }

  async ngOnInit() {
    this.appointment$ = this.appointmentProvider.appointment$;
    this.appointment$$ = this.appointment$
      .subscribe((sAppointment) => {
        if (sAppointment !== undefined && !this.loaded) { // CAN BE NULL !!!
          this.appointment = sAppointment;
          this.loaded = true;
          this.__SEO();
          this.main();
        } else if (!this.loaded) {
          this.appointmentSocketioService.loadAppointment(this.appointmentLink);
        } else {
          // IGNORE FURTHER UPDATES
        }
      });
  }

  /**
   * Initial function to send Enrollment
   */
  public parseDataFromEnrollmentForm: () => void = () => {
    if (!this.formsValid()) {
      return;
    }

    // Parse data from form into object
    this.finalEnrollment.name = this.getName().value;
    this.finalEnrollment.comment = this.getComment().value;
    this.parseDriverAddition();
    this.finalEnrollment.additions = this.getIdsOfSelectedAdditions();

    this.enrollmentAssignmentDecision();
  };

  /**
   * Initialize sending of enrollment.<br/>
   * Information gathering and enrollment assigning (account or mail)
   */
  public initializeEnrollmentSend: () => void = () => {
    if (!this.finalEnrollment.editMail && this.userIsLoggedIn && !this.isSelfEnrolling() && !this.triggerDirectSend) {
      this.showLoginAndMailForm = true;
      return;
    }

    if (this.isEdit) {
      this.sendEnrollmentRequest('update');
    } else {
      this.sendEnrollmentRequest('create');
    }
  };

  // Error handling
  public getNameErrorMessage(): string {
    if (this.getName().hasError('required')) {
      return 'Bitte gebe einen Namen an';
    }

    if (this.getName().hasError('inUse')) {
      return 'Es besteht bereits eine Anmeldung mit diesem Namen.';
    }
  }

  public getSelectErrorMessage(): string {
    if (this.getRequirement().hasError('required')) {
      return 'Bitte auswählen';
    }
  }

  public clearLoginAndMailFormIntercepting() {
    localStorage.removeItem(EnrollmentComponent.LOCAL_STORAGE_ENROLLMENT_TMP_KEY);

    this.showLoginAndMailForm = false;
  }

  public getSeatsErrorMessage() {
    if (this.getSeats().hasError('required')) {
      return 'Bite gebe die Anzahl FREIER Plätze an';
    }
  }

  public getDriver() {
    return this.form_driverPassenger.get('driver');
  }

  public getName() {
    return this.form_main.get('name');
  }

  public getAdditionsControls() {
    return (this.form_main.get('additions') as FormArray).controls;
  }

  public getSelfEnrollment() {
    return this.form_selfEnrollment.get('selfEnrollment');
  }


  public ngOnDestroy() {
    this.appointment$$.unsubscribe();
    if (this.appointmentService$$) {
      this.appointmentService$$.unsubscribe();
    }
  }

  public mailFormSubmit($event: string) {
    this.finalEnrollment.editMail = $event;
    this.enrollmentAssignmentDecision();
  }

  public mailFormCancel() {
    this.showLoginAndMailForm = false;
  }

  private parseDriverAddition() {
    if (this.appointment.driverAddition) {
      if (this.getDriver().value) {
        this.finalEnrollment.driver = {
          service: this.getService().value,
          seats: this.getSeats().value,
        };
        this.finalEnrollment.passenger = null;
      } else {
        this.finalEnrollment.passenger = {
          requirement: this.getRequirement().value,
        };
        this.finalEnrollment.driver = null;
      }
    }
  }

  private isSelfEnrolling() {
    return this.getSelfEnrollment().value && this.userIsLoggedIn;
  }

  private main(): void {
    // appointment can be null if it's not found
    if (this.appointment === null) {
      return;
    }

    this.isEdit = this.enrollmentId !== undefined;

    // Automatically insert username from current user
    if (this.userIsLoggedIn && !this.isEdit) {
      this.getName().setValue(this.authenticationService.currentUserValue.name);
    }

    if (this.isEdit) {
      // get referenced enrollment
      const enrollment: IEnrollmentModel = this.appointment.enrollments.filter(fEnrollment => {
        return fEnrollment.id === this.enrollmentId;
      })[0];

      if (enrollment) {
        this.finalEnrollment = enrollment;
        this.parseOutputIntoForm();
      } else if (this.enrollmentId !== null && this.permissionToken !== null) {
        this.enrollmentGone = true;
      }

      this.buildFormCheckboxes();
    } else {
      this.storageDataToFields();

      this.buildFormCheckboxes();

      if (this.triggerDirectSend) {
        this.initializeEnrollmentSend();
        return;
      }
    }
  }

  private __SEO() {
    this._seoService.updateTitle(`${this.appointment.title} - Anmelden`);
    this._seoService.updateDescription(this.appointment.title + ' - ' + this.appointment.description);
  }

  private getIdsOfSelectedAdditions: () => IAdditionModel[] = () => {
    const additionListRaw = this.form_main.value.additions
      .map((v, i) => v ? this.appointment.additions[i].id : null)
      .filter(v => v !== null);

    const additionList = [];
    additionListRaw.forEach(fAddition => {
      const addition = {id: fAddition};
      additionList.push(addition);
    });

    return additionList;
  };

  private buildFormCheckboxes: () => void = () => {
    this.appointment.additions.forEach((o) => {
      // if output has addition with this id then set to true
      let selected = false;
      if (this.finalEnrollment) {
        selected = this.finalEnrollment.additions.some(iAddition => iAddition.id === o.id);
      }
      const control = new FormControl(selected);
      (this.form_main.controls.additions as FormArray).push(control);
    });
  };

  private getSeats() {
    return this.form_driverPassenger.get('seats');
  }

  private getRequirement() {
    return this.form_driverPassenger.get('requirement');
  }

  private getService() {
    return this.form_driverPassenger.get('service');
  }

  private getComment() {
    return this.form_main.get('comment');
  }

  private parseOutputIntoForm() {
    this.form_main.get('name').setValue(this.finalEnrollment.name);
    this.form_main.get('comment').setValue(this.finalEnrollment.comment);
    if (this.finalEnrollment.driver != null) {
      this.form_driverPassenger.get('driver').setValue(this.finalEnrollment.driver);
      this.form_driverPassenger.get('seats').setValue(this.finalEnrollment.driver.seats);
      this.form_driverPassenger.get('service').setValue(this.finalEnrollment.driver.service);
    }

    if (this.finalEnrollment.passenger != null) {
      this.form_driverPassenger.get('requirement').setValue(this.finalEnrollment.passenger.requirement);
    }
  }

  private storageDataToFields() {
    // Fetch output from localStorage
    this.finalEnrollment_raw = localStorage.getItem(EnrollmentComponent.LOCAL_STORAGE_ENROLLMENT_TMP_KEY);
    this.finalEnrollment = JSON.parse(this.finalEnrollment_raw);

    if (this.finalEnrollment) {
      this.parseOutputIntoForm();
    } else {
      this.finalEnrollment = new EnrollmentModel();
    }
  }

  /**
   * Eventually send enrollment request, depending on edit or no edit;
   */
  private sendEnrollmentRequest(functionName: 'update' | 'create') {
    setTimeout(() => { // needed so loading directive triggers again after login or sth
      this.sendingRequestEmit.emit(true);
    });

    // fetch permission token if existing
    this.finalEnrollment.token = TokenUtil.getTokenForEnrollment(this.enrollmentId, this.appointmentLink);

    this.appointmentService$$ = this.enrollmentService[functionName](this.finalEnrollment, this.appointment)
      .subscribe(
        result => {
          if (result.type === HttpEventType.Response) {
            if (result.status === HttpStatus.CREATED || result.status === HttpStatus.OK) {
              if (functionName === 'create') {
                this.appointment.enrollments.push(result.body);
                this.appointmentProvider.update(this.appointment);

                // enrollment assigned to user by email (not account)
                if (result.body.token) {
                  AppointmentUtil.storeEnrollmentPermissions(this.appointmentLink, {
                    id: result.body.id,
                    token: result.body.token
                  });
                }
              } else {
                this.appointment.enrollments.map((mEnrollment) => mEnrollment.id === result.body.id ? result.body : mEnrollment);
              }

              this.request_success_finalize();
            }
          }
        }, (err: HttpErrorResponse) => {
          this.clearLoginAndMailFormIntercepting();
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

  private request_error_forbidden() {
    this.router.navigate([`enroll`],
      {
        queryParams: {
          a: this.appointment.link
        }
      })
      .then(() => {
        this.snackBar
          .open(`Sorry, du hast keine Berechtigung diesen Teilnehmer zu bearbeiten.`,
            '',
            {
              duration: 4000,
              panelClass: 'snackbar-error'
            }
          );
      });
  }

  private request_error_handleDuplicateValues(err: HttpErrorResponse) {
    err.error.data.forEach(fColumn => {
      const uppercaseName = fColumn.charAt(0).toUpperCase() + fColumn.substring(1);
      const fnName: string = 'get' + uppercaseName;

      this[fnName]().setErrors({inUse: true});
      this[fnName]().markAsTouched();
    });
  }

  private request_success_finalize() {
    this.clearLoginAndMailFormIntercepting();

    this.router
      .navigate([`enroll`],
        {
          queryParams: {
            a: this.appointment.link
          }
        })
      .then(() => {
        this.sendingRequestEmit.emit(false);

        this.snackBar
          .open(`Erfolgreich ` + (this.isEdit ? 'bearbeitet' : 'angemeldet'),
            '',
            {
              duration: 2000,
              panelClass: 'snackbar-default'
            }
          );
      });
  }

  /**
   * Determine if data can be send to API directly. This is the case, if the user is already logged in.
   * Otherwise, the user is asked to login with his account, or send the enrollment with his mail (for auth purposes). <br/>
   * For the possible redirect to the login page, the data needs to be stored locally, to be fetched later.
   */
  private enrollmentAssignmentDecision() {
    // If user selected selfEnrollment
    // Or if mail is set, then send enrollment

    if (this.isSelfEnrolling()
      || this.finalEnrollment.editMail
      || this.isEdit) {
      this.showLoginAndMailForm = false;
      this.initializeEnrollmentSend();
    } else {
      // not logged
      // TempStore item for possible login redirect
      localStorage.setItem(EnrollmentComponent.LOCAL_STORAGE_ENROLLMENT_TMP_KEY, JSON.stringify(this.finalEnrollment));

      this.showLoginAndMailForm = true;
    }
  }

  private formsValid() {
    // mark as touched when main enrollment is invalid
    if (!this.form_main.valid) {
      this.form_driverPassenger.markAllAsTouched();
      return false;
    }

    // Either check for driver or passenger form validity
    // return if selected is invalid
    if (this.getDriver().value) {
      if ((this.getService().valid && this.getSeats().valid)) {
      } else {
        this.form_driverPassenger.markAllAsTouched();
        return false;
      }
    } else if (!this.getRequirement().valid) {
      this.form_driverPassenger.markAllAsTouched();
      return false;
    }

    return true;
  }
}
