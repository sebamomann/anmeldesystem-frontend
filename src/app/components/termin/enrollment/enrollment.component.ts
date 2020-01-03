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

  driverEvent = this.formBuilder.group({
    driver: new FormControl(false),
    seats: new FormControl('', [Validators.min(1)]),
    requirement: new FormControl('', []),
    service: new FormControl('', [])
  });

  keyEvent = this.formBuilder.group({
    key: new FormControl('', [Validators.required])
  });

  private ENROLLMENT_OUTPUT_KEY = 'enrollmentOutput';
  private enrollmentOutputSet: boolean;
  private link: string;

  private percentDone: number;

  appointment: IAppointmentModel;

  snapshot: RouterStateSnapshot;

  private output = {
    name: '',
    comment: null,
    additions: [],
    driver: null,
    passenger: null,
  };

  constructor(private appointmentService: AppointmentService, private location: Location,
              private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router,
              private authenticationService: AuthenticationService) {

    // Current router URL for redirect when not logged in
    this.snapshot = router.routerState.snapshot;

    this.route.queryParams.subscribe(params => {
      this.link = params.val;
    });
  }

  async ngOnInit() {
    this.appointmentService.getAppointment(this.link).subscribe(sAppointment => {
      if (sAppointment.type === HttpEventType.DownloadProgress) {
        this.percentDone = Math.round(100 * sAppointment.loaded / sAppointment.total);
      } else if (sAppointment.type === HttpEventType.Response) {
        this.appointment = sAppointment.body;

        // parse data into form
        const localStroageOutput = localStorage.getItem(this.ENROLLMENT_OUTPUT_KEY);
        this.enrollmentOutputSet = localStroageOutput !== null;

        if (this.enrollmentOutputSet === true
          && this.userIsLoggedIn) {
          // Refetch output from local storage
          this.output = JSON.parse(localStroageOutput);

          this.parseStorageValuesIntoForm();

          this.sendEnrollment();
        }

        this.addCheckboxes();
      }
    }, error => {
      this.appointment = null;
    });
  }

  async setupEnrollment() {
    if (!this.event.valid) {
      this.event.markAllAsTouched();
      this.driverEvent.markAllAsTouched();
      return;
    }

    if (this.driverEvent.get('driver').value) {
      if ((this.driverEvent.get('service').valid && this.driverEvent.get('seats').valid)) {
      }
    } else if (!this.driverEvent.get('requirement').valid) {
      return;
    }

    this.output.name = this.event.get('name').value;
    this.output.comment = this.event.get('comment').value;

    if (this.appointment.driverAddition) {
      if (this.driverEvent.get('driver').value) {
        this.output.driver = {
          service: this.driverEvent.get('service').value,
          seats: this.driverEvent.get('seats').value,
        };
        this.output.passenger = null;
      } else {
        this.output.passenger = {
          requirement: this.driverEvent.get('requirement').value,
        };
        this.output.driver = null;
      }
    }

    this.output.additions = this.getAdditionIdList();

    localStorage.setItem(this.ENROLLMENT_OUTPUT_KEY, JSON.stringify(this.output));
    this.enrollmentOutputSet = true;

    if (this.userIsLoggedIn) {
      this.sendEnrollment();
    }
  }

  async sendEnrollment() {
    if (this.userIsLoggedIn || this.keyEvent.valid) {
      this.appointmentService
        .enroll(this.output, this.appointment)
        .subscribe(result => {
            localStorage.removeItem(this.ENROLLMENT_OUTPUT_KEY);
            this.enrollmentOutputSet = false;
            if (result.type === HttpEventType.Response) {
              switch (result.status) {
                case HttpStatus.CREATED:
                  this.router.navigate([`enroll`], {
                    queryParams: {
                      val: this.appointment.link
                    }
                  });
                  break;
              }
            }
          }, (err: HttpErrorResponse) => {
            console.log(err);
            switch (err.status) {
              case HttpStatus.BAD_REQUEST:
                if (err.error.code === 'DUPLICATE_ENTRY') {
                  err.error.columns.forEach(fColumn => {
                      const uppercaseName = fColumn.charAt(0).toUpperCase() + fColumn.substring(1);
                      const fnName: string = 'get' + uppercaseName;
                      this[fnName]().setErrors({inUse: true});
                    }
                  );
                }
                break;
            }
          }
        );
    }
  }

  getAdditionIdList(): IAdditionModel[] {
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

  private addCheckboxes() {
    this.appointment.additions.forEach((o, i) => {
      const control = new FormControl(this.output.additions.some(iAddition => iAddition.id === o.id));
      (this.event.controls.additions as FormArray).push(control);
    });
  }

  // Error handling
  getNameErrorMessage(): string {
    if (this.getName().hasError('required')) {
      return 'Bitte gebe einen Namen an';
    }

    if (this.getName().hasError('inUse')) {
      return 'Es besteht bereits eine Anmeldung mit diesem Namen.';
    }
  }

  getSelectError(): string {
    if (this.getRequirement().hasError('required')) {
      return 'Bitte auswählen';
    }
  }

  getTokenError() {
    if (this.getToken().hasError('required')) {
      return 'Bitte geben einen Token an';
    }
  }

  // Utility
  private parseStorageValuesIntoForm() {
    this.event.get('name').setValue(this.output.name);
    this.event.get('comment').setValue(this.output.comment);
    if (this.output.driver != null) {
      this.driverEvent.get('driver').setValue(this.output.driver);
      this.driverEvent.get('seats').setValue(this.output.driver.seats);
      this.driverEvent.get('service').setValue(this.output.driver.service);
    }

    if (this.output.passenger != null) {
      this.driverEvent.get('requirement').setValue(this.output.passenger.requirement);
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
    return this.driverEvent.get('seats');
  }

  private getRequirement() {
    return this.driverEvent.get('requirement');
  }

  private getName() {
    return this.event.get('name');
  }

  private getAdditionsControls() {
    return (this.event.get('additions') as FormArray).controls;
  }

  goBack() {
    this.location.back();
  }
}
