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
import {IEnrollmentModel} from '../../../models/IEnrollment.model';
import {EnrollmentService} from '../../../services/enrollment.service';
import {EnrollmentModel} from '../../../models/EnrollmentModel.model';
import {merge, Observable, Subject} from 'rxjs';
import {mapTo, mergeMap, skip, switchMap, take} from 'rxjs/operators';

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
  private link: string;

  userIsLoggedIn: boolean = this.authenticationService.currentUserValue !== null;

  selfEnrollment = this.formBuilder.group({
    selfEnrollment: new FormControl('true', []),
  });

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

  mailEvent = this.formBuilder.group({
    mail: new FormControl('', [Validators.required, Validators.email]),
  });

  public appointment: IAppointmentModel = null;
  public edit: any;
  public token: any;

  constructor(private appointmentService: AppointmentService, private enrollmentService: EnrollmentService,
              private location: Location,
              private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router,
              private authenticationService: AuthenticationService, private snackBar: MatSnackBar) {

    this.currentUrlSnapshotWithParameter = router.routerState.snapshot;

    this.route.queryParams.subscribe(params => {
      this.link = params.a;
      this.enrollmentId = params.e;
      this.token = params.t;
      this.autoSend = params.send === 'true';

      this.handleTokenPermission(this.link, {id: this.enrollmentId, token: this.token});
      // const ids = [];
      // const tokens = [];
      // for (const queryKey of Object.keys(params)) {
      //   if (queryKey.startsWith('perm')) {
      //     ids.push(params[queryKey]);
      //   }
      //
      //   if (queryKey.startsWith('token')) {
      //     tokens.push(params[queryKey]);
      //   }
      // }
      //
      // ids.forEach((fId, i) => {
      //   this.handleTokenPermission(this.link, {id: fId, token: tokens[i]});
      // });
    });
  }

  private enrollmentId: string;
  public percentDone: number;
  // Preparation for login redirect fields
  private ENROLLMENT_KEY_KEY = 'enrollmentKeys';
  private outputRawFromStorage: string;
  private output: IEnrollmentModel = new EnrollmentModel();
  public showLoginAndTokenForm: boolean;
  public currentUrlSnapshotWithParameter: RouterStateSnapshot;
  // Key fields
  private ENROLLMENT_OUTPUT_KEY = 'enrollmentOutput';
  public localStorageKeys: string[];
  // Sending options
  private autoSend = false;
  private autoSubmitBySetting = false;

  // CACHE
  appointment$: Observable<IAppointmentModel>;
  showNotification$: Observable<boolean>;
  update$ = new Subject<void>();
  forceReload$ = new Subject<void>();

  async ngOnInit() {
    await this.route
      .data
      .subscribe(v => this.edit = v.edit);

    // Needed due to error permanent trigger, if value is put in via form [value]
    if (this.userIsLoggedIn && !this.edit) {
      this.getName().markAsTouched();
      this.getName().setValue(this.authenticationService.currentUserValue.name);
    }

    const initialAppointment$ = this.getDataOnce();

    const updates$ = merge(this.update$, this.forceReload$).pipe(
      mergeMap(() => this.getDataOnce())
    );

    this.appointment$ = merge(initialAppointment$, updates$);
    this.appointment$.subscribe(sAppointment => {
      this.appointment = sAppointment;
    });

    const reload$ = this.forceReload$.pipe(switchMap(() => this.getNotifications()));
    const initialNotifications$ = this.getNotifications();
    const show$ = merge(initialNotifications$, reload$).pipe(mapTo(true));
    const hide$ = this.update$.pipe(mapTo(false));
    this.showNotification$ = merge(show$, hide$);

    this.successfulRequest();
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

  private successfulRequest(): void {
    this.appointment$.subscribe(sAppointment => {
      this.appointment = sAppointment;
      this.storageDataToFields();
      // When e.g. coming from login
      if (this.showLoginAndTokenForm === true) {
        // Re-fetch output from local storage
        this.output = JSON.parse(this.outputRawFromStorage);
        this.parseOutputIntoForm();

        if (this.autoSend) {
          this.sendEnrollment();
        }
      } else if (this.edit) {
        const enrollment: IEnrollmentModel = this.appointment.enrollments.filter(fEnrollment => {
          return fEnrollment.id === this.enrollmentId;
        })[0];

        if (enrollment !== null) {
          this.output = enrollment;
          this.parseOutputIntoForm();
        }
      } else {
        // DO NOTHING, BECAUSE FORM IS EMPTY FOR ADDING NEW ENROLLMENT
      }

      this.buildFormCheckboxes();
    });
  }

  /**
   * Main function on initializing sending of data to API
   * Called by usual enroll form
   */
  parseDataFromEnrollmentForm: () => Promise<void> = async () => {
    // TODO
    // refactor
    if (!this.event.valid) {
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

    if (this.userIsLoggedIn &&
      !this.getSelfEnrollment().value) {
      if (this.mailEvent.valid) {
        this.output.editMail = this.getMail().value;
      } else {
        this.mailEvent.markAllAsTouched();
        this.getMail().setErrors({invalid: true});
        return;
      }
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
  };

  /**
   * Eventually sending/updating Enrollment
   */
  sendEnrollment: () => Promise<void> = async () => {
    if (this.mailEvent.invalid
      && !this.userIsLoggedIn && !this.edit) {
      this.mailEvent.markAllAsTouched();
      return;
    }

    // Set key, if logged in but not selfenroll
    // Set key if not logged in and token specified by after enroll screen
    if ((!this.userIsLoggedIn || (this.userIsLoggedIn && !this.getSelfEnrollment().value)) && !this.edit) {
      this.output.editMail = this.getMail().value;
    }

    if (this.userIsLoggedIn || this.mailEvent.valid || this.edit) {
      if (this.edit) {
        this.sendEnrollmentRequest('update');
      } else {
        this.sendEnrollmentRequest('create');
      }
      this.event.markAllAsTouched();
    }
  };

  private getAdditionIdList: () => IAdditionModel[] = () => {
    const additionListRaw = this.event.value.additions
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
      const control = new FormControl(this.output.additions.some(iAddition => iAddition.id === o.id));
      (this.event.controls.additions as FormArray).push(control);
    });
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

  public getExistingKeyErrorMessage(): string {
    if (this.getMail().hasError('required')) {
      return 'Bitte auswählen';
    }
  }

  public getMailErrorMessage() {
    if (this.getMail().hasError('required')) {
      return 'Bitte angeben';
    }
    if (this.getMail().hasError('email')) {
      return 'Bitte eine gültige Email angeben';
    }
  }

  public clearLoginAndMailFormIntercepting() {
    localStorage.removeItem(this.ENROLLMENT_OUTPUT_KEY);
    this.showLoginAndTokenForm = false;
  }

  public getSeatsErrorMessage() {
    if (this.getSeats().hasError('required')) {
      return 'Bite gebe die Anzahl FREIER Plätze an';
    }
  }

  private async sendEnrollmentRequest(functionName: string) {
    console.log(this.getTokenForEnrollment(this.enrollmentId, this.link));
    this.output.token = this.getTokenForEnrollment(this.enrollmentId, this.link);
    this.enrollmentService[functionName](this.output, this.appointment)
      .subscribe(
        result => {
          this.clearLoginAndMailFormIntercepting();
          if (result.type === HttpEventType.Response) {
            if (result.status === HttpStatus.CREATED
              || result.status === HttpStatus.OK) {
              if (functionName === 'create') {
                this.appointment.enrollments.push(result.body);
                if (result.body.token !== undefined) {
                  this.handleTokenPermission(this.link, result.body);
                }
              } else if (functionName === 'update') {
                this.appointment.enrollments.map(obj => {
                  if (obj.id === result.body.id) {
                    return result.body;
                  }
                });
              }

              this.router.navigate([`enroll`], {
                queryParams: {
                  a: this.appointment.link
                }
              }).then((navigated: boolean) => {
                if (navigated) {
                  this.snackBar.open(`Erfolgreich ` + (this.edit ? 'bearbeitet' : 'angemeldet'),
                    '',
                    {
                      duration: 2000,
                      panelClass: 'snackbar-default'
                    });
                }
              });
            }
          }
        }, async (err: HttpErrorResponse) => {
          this.clearLoginAndMailFormIntercepting();
          if (err.status === HttpStatus.BAD_REQUEST) {
            if (err.error.code === 'DUPLICATE_ENTRY') {
              this.event.markAllAsTouched();
              await err.error.error.forEach(fColumn => {
                const uppercaseName = fColumn.charAt(0).toUpperCase() + fColumn.substring(1);
                const fnName: string = 'get' + uppercaseName;
                this[fnName]().markAsTouched();
                this[fnName]().setErrors({inUse: true});
              });
            }
          } else if (err.status === HttpStatus.FORBIDDEN) {
            this.router.navigate([`enroll`], {
              queryParams: {
                a: this.appointment.link
              }
            }).then((navigated: boolean) => {
              if (navigated) {
                this.snackBar.open(`Sorry, du hast keine Berechtigung diesen Teilnehmer zu bearbeiten.`,
                  '',
                  {
                    duration: 4000,
                    panelClass: 'snackbar-error'
                  });
              }
            });
          }
        }
      );
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

  public getDriver() {
    return this.driverPassengerEvent.get('driver');
  }

  private getName() {
    return this.event.get('name');
  }

  private getComment() {
    return this.event.get('comment');
  }

  public getAdditionsControls() {
    return (this.event.get('additions') as FormArray).controls;
  }

  public getSelfEnrollment() {
    return this.selfEnrollment.get('selfEnrollment');
  }

  // Utility
  private parseOutputIntoForm() {
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

  private storageDataToFields() {
    // Fetch output from localStorage
    this.outputRawFromStorage = localStorage.getItem(this.ENROLLMENT_OUTPUT_KEY);
    this.showLoginAndTokenForm = this.outputRawFromStorage !== null;

    // Fetch key from LocalStorage
    this.localStorageKeys = JSON.parse(localStorage.getItem(this.ENROLLMENT_KEY_KEY));
    if (this.localStorageKeys === null) {
      this.localStorageKeys = [];
    }
  }

  private getMail() {
    return this.mailEvent.get('mail');
  }

  /**
   * Determine if data can be send to API directly. This is the case, if the user is already logged in.
   * Otherwise, the user is asked to login with his account, or send the enrollment with his mail (for auth purposes). <br/>
   * For the possible redirect to the login page, the data needs to be stored locally, to be fetched later.
   */
  private checkForAutomaticSubmit() {
    // If user selected selfEnrollment
    // Or if key is set
    if (((this.getSelfEnrollment().value && this.userIsLoggedIn)
      || this.output.editMail !== undefined) || this.edit) {
      this.sendEnrollment().then(() => '');
    } else {
      // TempStore item for possible login redirect
      localStorage.setItem(this.ENROLLMENT_OUTPUT_KEY, JSON.stringify(this.output));
      this.showLoginAndTokenForm = true;
    }
  }

  goBack() {
    this.location.back();
  }

  private handleTokenPermission(link: string, body: any) {
    let permissions = JSON.parse(localStorage.getItem('permissions'));

    if (permissions === null ||
      permissions === undefined) {
      permissions = [];
    }

    let linkElem = permissions.find(fElement => fElement.link === link);
    let push = false;
    if (linkElem === undefined) {
      linkElem = {link, enrollments: []};
      push = true;
    }

    if (!linkElem.enrollments.some(sPermission => sPermission.id === body.id)) {
      linkElem.enrollments.push({id: body.id, token: body.token});
    }

    if (push) {
      permissions.push(linkElem);
    }

    localStorage.setItem('permissions', JSON.stringify(permissions));
  }

  private getTokenForEnrollment(id: string, link: string) {
    const permissions = JSON.parse(localStorage.getItem('permissions'));
    const linkElem = permissions.find(fElement => fElement.link === link);
    const elem = linkElem.enrollments.filter(sPermission => sPermission.id === id);
    if (elem !== undefined) {
      return elem[0].token;
    } else {
      return '';
    }
  }
}
