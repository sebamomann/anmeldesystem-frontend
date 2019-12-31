import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';
import {TerminService} from '../../../services/termin.service';
import {Location} from '@angular/common';
import {Observable} from 'rxjs';
import {IAppointmentModel} from '../../../models/IAppointment.model';
import {ActivatedRoute} from '@angular/router';
import {IEnrollmentModel} from '../../../models/IEnrollment.model';
import {IAdditionModel} from '../../../models/IAddition.model';

@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.scss']
})
export class EnrollmentComponent implements OnInit {
  event = this.formBuilder.group({
    name: new FormControl('', [Validators.required, Validators.min(2)]),
    comment: new FormControl('', [Validators.required, Validators.min(2)]),
    additions: new FormArray([]),
    driver: new FormControl(false),
    seats: new FormControl('', [Validators.min(1)]),
    requirement: new FormControl('', []),
    service: new FormControl('', [])
  });

  appointment$: Observable<IAppointmentModel>;
  appointment = null;
  additions = [];

  private link: string;

  constructor(private terminService: TerminService, private location: Location,
              private formBuilder: FormBuilder, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.link = params.val;
    });
  }

  async ngOnInit() {
    await this.terminService.getAppointment(this.link).subscribe(sAppointment => {
      this.appointment$ = new Observable<IAppointmentModel>(sAppointment.body);
      this.appointment = sAppointment.body;
      this.addCheckboxes();
    }, error => {
      this.appointment$ = undefined;
    });

  }

  async create() {
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

    this.terminService.enroll(output, this.appointment).subscribe(resposne => {
    });
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
    this.appointment$.subscribe(appointment => {
      appointment.additions.forEach((o, i) => {
        const control = new FormControl(); // if first item set to true, else false
        (this.event.controls.additions as FormArray).push(control);
      });
    });
  }

  getUsernameErrorMessage(): string {
    if (this.getUsername().hasError('required')) {
      return 'Bitte gebe einen Benutezrnamen an';
    }

    if (this.getUsername().hasError('inUse')) {
      return 'Dieser Benutzername ist bereits vergeben';
    }
  }


  private getUsername() {
    return this.event.get('username');
  }

  getAdditionsControls() {
    return (this.event.get('additions') as FormArray).controls;
  }

  getNameErrorMessage() {
    return '';
  }

  getSeatsErrorMessage() {
    return '';
  }

  goBack() {
    this.location.back();
  }
}
