import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';
import {TerminService} from '../../../services/termin.service';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {IEnrollmentModel} from '../../../models/IEnrollment.model';
import {IAdditionModel} from '../../../models/IAddition.model';
import {IAppointmentModel} from '../../../models/IAppointment.model';
import {HttpErrorResponse, HttpEventType} from '@angular/common/http';
import {animate, state, style, transition, trigger} from '@angular/animations';

const HttpStatus = require('http-status-codes');


@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({opacity: 100})),
      transition('* => void', [
        animate(400, style({opacity: 0}))
      ])
    ])
  ]
})
export class EnrollmentComponent implements OnInit {
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

  constructor(private terminService: TerminService, private location: Location,
              private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.link = params.val;
    });
  }

  async ngOnInit() {
    await this.terminService.getAppointment(this.link).subscribe(sAppointment => {
      if (sAppointment.type === HttpEventType.DownloadProgress) {
        this.percentDone = Math.round(100 * sAppointment.loaded / sAppointment.total);
      } else if (sAppointment.type === HttpEventType.Response) {
        this.appointment = sAppointment.body;
        this.addCheckboxes();
      }
    }, error => {
      this.appointment = null;
    });

  }

  async create() {
    if (!this.event.valid) {
      return;
    }

    let output: IEnrollmentModel;
    output = {
      additions: [],
      driver: null,
      passenger: null,
      name: this.event.get('name').value,
      comment: this.event.get('comment').value
    };

    if (this.appointment.driverAddition) {
      if (this.event.get('driver').value) {
        output.driver = {
          service: this.event.get('service').value,
          seats: this.event.get('seats').value,
        };
        output.passenger = null;
      } else {
        output.passenger = {
          requirement: this.event.get('requirement').value,
        };
        output.driver = null;
      }
    }

    output.additions = this.getAdditionIdList();

    this.terminService
      .enroll(output, this.appointment)
      .subscribe(result => {
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
