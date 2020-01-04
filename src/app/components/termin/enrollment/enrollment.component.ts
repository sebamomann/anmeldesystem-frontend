import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';
import {AppointmentService} from '../../../services/appointment.service';
import {Location} from '@angular/common';
import {ActivatedRoute, Router, RouterStateSnapshot} from '@angular/router';
import {IAdditionModel} from '../../../models/IAddition.model';
import {IAppointmentModel} from '../../../models/IAppointment.model';
import {HttpErrorResponse, HttpEventType} from '@angular/common/http';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AuthenticationService} from '../../../services/authentication.service';
import {MatSnackBar} from '@angular/material';

const HttpStatus = require('http-status-codes');


@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({opacity: 100})),
      transition('* => void', [
        animate(1000, style({opacity: 1})),
        animate(500, style({opacity: 0}))
      ])
    ])
  ]
})
export class EnrollmentComponent implements OnInit {
  userIsLoggedIn: boolean = this.authenticationService.currentUserValue !== null;

  event = this.formBuilder.group({
    name: new FormControl('', [Validators.required, Validators.min(2)]),
    comment: new FormControl('', [Validators.min(2)]),
    additions: new FormArray([]),
  });

  driverPassengerEvent = this.formBuilder.group({
    driver: new FormControl(false),
    seats: new FormControl('', [Validators.min(1)]),
    requirement: new FormControl('', []),
    service: new FormControl('', [])
  });

  keyEvent = this.formBuilder.group({
    key: new FormControl('', [Validators.required, Validators.min(4)])
  });
  appointment: IAppointmentModel;
  private appointmentLink: string;
  private percentDone: number;
  // Preparation for login redirect fields
  private ENROLLMENT_KEY_KEY = 'enrollmentKey';
  private enrollmentOutputInStorage: boolean;
  private currentUrlSnapshotWithParameter: RouterStateSnapshot;
  // Key fields
  private ENROLLMENT_OUTPUT_KEY = 'enrollmentOutput';
  private localStorageKey: string;
  private keyReadonly = false;


  private output = {
    name: '',
    comment: null,
    additions: [],
    driver: null,
    passenger: null,
    editKey: ''
  };


  constructor(private appointmentService: AppointmentService, private location: Location,
              private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router,
              private authenticationService: AuthenticationService, private snackBar: MatSnackBar) {

    this.currentUrlSnapshotWithParameter = router.routerState.snapshot;

    this.route.queryParams.subscribe(params => {
      this.appointmentLink = params.val;
    });
  }

  async ngOnInit() {
    this.appointmentService
      .getAppointment(this.appointmentLink)
      .subscribe(
        sAppointment => {
          if (sAppointment.type === HttpEventType.DownloadProgress) {
            this.percentDone = Math.round(100 * sAppointment.loaded / sAppointment.total);
          } else if (sAppointment.type === HttpEventType.Response) {
            this.appointment = sAppointment.body;

            // Fetch output from localStorage
            const localStorageOutput = localStorage.getItem(this.ENROLLMENT_OUTPUT_KEY);
            this.enrollmentOutputInStorage = localStorageOutput !== null;

            // Fetch key from LocalStorage
            this.localStorageKey = localStorage.getItem(this.ENROLLMENT_KEY_KEY);
            this.keyReadonly = this.localStorageKey !== null && this.localStorageKey !== '';

            // When e.g. coming from login
            if (this.enrollmentOutputInStorage === true) {
              // Re-fetch output from local storage
              this.output = JSON.parse(localStorageOutput);
              this.parseStorageValuesIntoForm();

              // Auto send if logged in
              if (this.userIsLoggedIn) {
                this.sendEnrollment();
              }
            }

            this.buildFormCheckboxes();
          }
        }, () => {
          this.appointment = null;
        }
      );
  }

  async parseDataFromEnrollForm() {
    if (!this.event.valid) {
      this.event.markAllAsTouched();
      this.driverPassengerEvent.markAllAsTouched();
      return;
    }

    if (this.getDriver().value) {
      if ((this.getService().valid && this.getSeats().valid)) {
      }
    } else if (!this.getRequirement().valid) {
      this.driverPassengerEvent.markAllAsTouched();
      return;
    }

    // Parse data from form into object
    this.output.name = this.getName().value;
    this.output.comment = this.getComment().value;

    if (this.appointment.driverAddition) {
      if (this.getDriver().value) {
        this.output.driver = {
          service: this.getService().value,
          seats: this.getSeats().value,
        };
        this.output.passenger = null;
      } else {
        this.output.passenger = {
          requirement: this.getRequirement().value,
        };
        this.output.driver = null;
      }
    }

    this.output.additions = this.getAdditionIdList();

    this.checkForAutomaticSubmit();
  }

  async sendEnrollment() {
    if (this.keyEvent.invalid && !this.userIsLoggedIn && !this.keyReadonly) {
      this.keyEvent.markAllAsTouched();
      return;
    }

    this.setTokenIfNotSet();

    if (!this.userIsLoggedIn) {
      this.output.editKey = this.localStorageKey;
    }

    if (this.userIsLoggedIn || this.keyEvent.valid || this.keyReadonly) {
      this.appointmentService
        .enroll(this.output, this.appointment)
        .subscribe(
          result => {
            this.clearLoginAndTokenIntercept();
            if (result.type === HttpEventType.Response) {
              if (result.status === HttpStatus.CREATED) {
                this.router.navigate([`enroll`], {
                  queryParams: {
                    val: this.appointment.link
                  }
                }).then((navigated: boolean) => {
                  if (navigated) {
                    this.snackBar.open('Erfolgreich angemeldet', '', {
                      duration: 4000,
                      panelClass: 'snackbar-default'
                    });
                  }
                });
              }
            }
          }, (err: HttpErrorResponse) => {
            this.clearLoginAndTokenIntercept();
            if (err.status === HttpStatus.BAD_REQUEST) {
              if (err.error.code === 'DUPLICATE_ENTRY') {
                err.error.error.forEach(fColumn => {
                    const uppercaseName = fColumn.charAt(0).toUpperCase() + fColumn.substring(1);
                    const fnName: string = 'get' + uppercaseName;
                    this[fnName]().setErrors({inUse: true});
                  }
                );
              }
            }
          }
        );
    }
  }

  private getAdditionIdList(): IAdditionModel[] {
    const additionListRaw = this.event.value.additions
      .map((v, i) => v ? this.appointment.additions[i].id : null)
      .filter(v => v !== null);

    const additionList = [];
    additionListRaw.forEach(fAddition => {
      const addition = {id: fAddition};
      additionList.push(addition);
    });

    return additionList;
  }

  private buildFormCheckboxes() {
    this.appointment.additions.forEach((o) => {
      const control = new FormControl(this.output.additions.some(iAddition => iAddition.id === o.id));
      (this.event.controls.additions as FormArray).push(control);
    });
  }

  // Error handling
  private getNameErrorMessage(): string {
    if (this.getName().hasError('required')) {
      return 'Bitte gebe einen Namen an';
    }

    if (this.getName().hasError('inUse')) {
      return 'Es besteht bereits eine Anmeldung mit diesem Namen.';
    }
  }

  private getSelectErrorMessage(): string {
    if (this.getRequirement().hasError('required')) {
      return 'Bitte auswählen';
    }
  }

  private getTokenErrorMessage(): string {
    if (this.getToken().hasError('required')) {
      return 'Bitte geben einen Token an';
    }
  }

  private getSeatsErrorMessage() {
    if (this.getSeats().hasError('required')) {
      return 'Bite gebe die Anzahl FREIER Plätze an';
    }
  }

  private getToken() {
    return this.keyEvent.get('key');
  }

  private getSeats() {
    return this.driverPassengerEvent.get('seats');
  }

  private getRequirement() {
    return this.driverPassengerEvent.get('requirement');
  }

  private getService() {
    return this.driverPassengerEvent.get('service');
  }

  private getDriver() {
    return this.driverPassengerEvent.get('driver');
  }

  private getName() {
    return this.event.get('name');
  }

  private getComment() {
    return this.event.get('comment');
  }

  private getAdditionsControls() {
    return (this.event.get('additions') as FormArray).controls;
  }


  // Utility
  private parseStorageValuesIntoForm() {
    this.event.get('name').setValue(this.output.name);
    this.event.get('comment').setValue(this.output.comment);
    if (this.output.driver != null) {
      this.driverPassengerEvent.get('driver').setValue(this.output.driver);
      this.driverPassengerEvent.get('seats').setValue(this.output.driver.seats);
      this.driverPassengerEvent.get('service').setValue(this.output.driver.service);
    }

    if (this.output.passenger != null) {
      this.driverPassengerEvent.get('requirement').setValue(this.output.passenger.requirement);
    }
  }

  private setTokenIfNotSet() {
    const value = this.keyEvent.get('key').value;
    if (this.localStorageKey === '' || this.localStorageKey === null) {
      localStorage.setItem(this.ENROLLMENT_KEY_KEY, value);
    }
  }

  private clearLoginAndTokenIntercept() {
    localStorage.removeItem(this.ENROLLMENT_OUTPUT_KEY);
    this.enrollmentOutputInStorage = false;
  }

  private checkForAutomaticSubmit() {
    // If user is logged in dont ask for login or token. Just send
    if (this.userIsLoggedIn) {
      this.sendEnrollment().then(() => '');
    } else {
      // TempStore item for possible login redirect
      localStorage.setItem(this.ENROLLMENT_OUTPUT_KEY, JSON.stringify(this.output));
      this.enrollmentOutputInStorage = true;
    }
  }
}
