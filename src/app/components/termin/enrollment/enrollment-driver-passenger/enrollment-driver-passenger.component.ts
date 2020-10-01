import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IAppointmentModel} from '../../../../models/IAppointment.model';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {IEnrollmentModel} from '../../../../models/IEnrollment.model';

@Component({
  selector: 'app-enrollment-driver-passenger',
  templateUrl: './enrollment-driver-passenger.component.html',
  styleUrls: ['./enrollment-driver-passenger.component.scss']
})
export class EnrollmentDriverPassengerComponent implements OnInit {

  @Output('done') done__ = new EventEmitter();
  @Output('cancel') cancel__ = new EventEmitter();

  @Input() appointment: IAppointmentModel;
  @Input() enrollment: IEnrollmentModel;

  public form = this.formBuilder.group({
    driver: new FormControl(false),
    driverForm: this.formBuilder.group({
      seats: new FormControl('', [Validators.min(1)]),
      service: new FormControl('', [Validators.required]),
    }),
    passengerForm: this.formBuilder.group({
      requirement: new FormControl('', [Validators.required]),
    })
  });

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.fillForm();
  }

  public save() {
    const output: any = {};

    if (this.appointment.driverAddition) {
      if (this.getDriver().value
        && this.form.controls.driverForm.valid) {
        output.driver = {
          service: this.getService().value,
          seats: this.getSeats().value,
        };

        output.passenger = null;

        this.done__.emit(output);
      } else if (this.form.controls.passengerForm.valid) {
        output.passenger = {
          requirement: this.getRequirement().value,
        };

        output.driver = null;
        this.done__.emit(output);
      }
    }
  }

  public cancel() {
    this.cancel__.emit();
  }

  public getDriver() {
    return this.form.get('driver');
  }

  public getSelectErrorMessage(): string {
    if (this.getRequirement().hasError('required')) {
      return 'Bitte auswählen';
    }
  }

  public getSeatsErrorMessage() {
    if (this.getSeats().hasError('required')) {
      return 'Bite gebe die Anzahl FREIER Plätze an';
    }
  }

  private fillForm() {
    if (this.enrollment) {
      if (this.enrollment.driver != null) {
        this.form.get('driver').setValue(this.enrollment.driver);
        this.form.get('seats').setValue(this.enrollment.driver.seats);
        this.form.get('service').setValue(this.enrollment.driver.service);
      }

      if (this.enrollment.passenger != null) {
        this.form.get('requirement').setValue(this.enrollment.passenger.requirement);
      }
    }
  }

  private getRequirement() {
    return this.form.controls.passengerForm.get('requirement');
  }

  private getService() {
    return this.form.controls.driverForm.get('service');
  }

  private getSeats() {
    return this.form.controls.driverForm.get('seats');
  }
}
