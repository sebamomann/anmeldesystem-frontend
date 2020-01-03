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
    driver: new FormControl(false),
    seats: new FormControl('', [Validators.min(1)]),
    requirement: new FormControl('', []),
    service: new FormControl('', [])
  });

  appointment: IAppointmentModel;
  additions = [];

  private link: string;
  private percentDone;
  keyEvent: any;
  snapshot: RouterStateSnapshot;
  private ENROLLMENT_OUTPUT_KEY = 'enrollmentOutput';
  private output = {
    name: '',
    comment: null,
    additions: [],
    driver: null,
    passenger: null,
  };
  private enrollmentOutputSet: boolean;

  constructor(private appointmentService: AppointmentService, private location: Location,
              private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router,
              private authenticationService: AuthenticationService) {

    this.snapshot = router.routerState.snapshot;

    this.route.queryParams.subscribe(params => {
      this.link = params.val;
    });

    this.keyEvent = this.formBuilder.group({
      key: new FormControl('', [Validators.required])
    });
  }

  async ngOnInit() {
    this.appointmentService.getAppointment(this.link).subscribe(sAppointment => {
      if (sAppointment.type === HttpEventType.DownloadProgress) {
        this.percentDone = Math.round(100 * sAppointment.loaded / sAppointment.total);
      } else if (sAppointment.type === HttpEventType.Response) {
        this.appointment = sAppointment.body;
        this.addCheckboxes();
        this.enrollmentOutputSet = localStorage.getItem(this.ENROLLMENT_OUTPUT_KEY) !== null;

        if (this.enrollmentOutputSet !== null
          && this.userIsLoggedIn) {
          this.sendEnrollment();
        }
      }
    }, error => {
      this.appointment = null;
    });

  }

  async setupEnrollment() {
    if (!this.event.valid) {
      return;
    }

    this.output.name = this.event.get('name').value;
    this.output.comment = this.event.get('comment').value;

    if (this.appointment.driverAddition) {
      if (this.event.get('driver').value) {
        this.output.driver = {
          service: this.event.get('service').value,
          seats: this.event.get('seats').value,
        };
        this.output.passenger = null;
      } else {
        this.output.passenger = {
          requirement: this.event.get('requirement').value,
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
      const output = localStorage.getItem(this.ENROLLMENT_OUTPUT_KEY);
      this.output = JSON.parse(output);

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
      const control = new FormControl(); // if first item set to true, else false
      (this.event.controls.additions as FormArray).push(control);
    });
  }

  getNameErrorMessage(): string {
    if (this.getName().hasError('required')) {
      return 'Bitte gebe einen Benutezrnamen an';
    }

    if (this.getName().hasError('inUse')) {
      return 'Es besteht bereits eine Anmeldung mit diesem Namen.';
    }
  }

  getTokenError() {
    if (this.getToken().hasError('required')) {
      return 'Bitte einen Token angeben';
    }
  }

  private getToken() {
    return this.keyEvent.get('key');
  }

  private getName() {
    return this.event.get('name');
  }

  getAdditionsControls() {
    return (this.event.get('additions') as FormArray).controls;
  }

  getSeatsErrorMessage() {
    return '';
  }

  goBack() {
    this.location.back();
  }
}
