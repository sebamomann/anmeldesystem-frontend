import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IAppointmentModel} from '../../../../models/IAppointment.model';
import {IEnrollmentModel} from '../../../../models/IEnrollment.model';
import {FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';
import {EnrollmentModel} from '../../../../models/EnrollmentModel.model';
import {AuthenticationService} from '../../../../services/authentication.service';
import {IAdditionModel} from '../../../../models/IAddition.model';

@Component({
  selector: 'app-enrollment-edit',
  templateUrl: './enrollment-edit.component.html',
  styleUrls: ['./enrollment-edit.component.scss']
})
export class EnrollmentEditComponent implements OnInit {
  @Input() appointment: IAppointmentModel;
  @Input() sendingRequestEmit: EventEmitter<boolean>;
  @Input() triggerDirectSend: boolean;
  @Input() enrollmentId: string;
  @Input() permissionToken: string;
  @Output() execute: EventEmitter<{ operation: string, enrollment: IEnrollmentModel }>
    = new EventEmitter<{ operation: string, enrollment: IEnrollmentModel }>();

  public userIsLoggedIn: boolean = this.authenticationService.userIsLoggedIn();

  public enrollmentGone = false;
  public creatorError = false;

  public form_main = this.formBuilder.group({
    name: new FormControl({value: ''}, [Validators.required, Validators.min(2)]),
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

  private finalEnrollment: IEnrollmentModel = new EnrollmentModel();

  constructor(private formBuilder: FormBuilder, private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    // get referenced enrollment
    const enrollment: IEnrollmentModel = this.appointment.enrollments.filter(fEnrollment => {
      return fEnrollment.id === this.enrollmentId;
    })[0];

    if (enrollment) {
      this.finalEnrollment = enrollment;
      if (enrollment.creator) {
        this.disableNameInput();
      }
      this.parseOutputIntoForm();
    } else if (this.enrollmentId !== null && this.permissionToken !== null) {
      this.enrollmentGone = true;
    }

    this.buildFormCheckboxes();
  }

  /**
   * Initialize sending of enrollment.<br/>
   * Information gathering and enrollment assigning (account or mail)
   */
  public initializeEnrollmentSend: () => void = () => {
    if (this.finalEnrollment.creator) {
      delete this.finalEnrollment.name;
    }

    this.finalEnrollment.token = this.permissionToken;

    this.execute.emit({operation: 'update', enrollment: this.finalEnrollment});
  };

  /**
   * Initial function to send Enrollment
   */
  public parseDataFromEnrollmentForm: () => void = () => {
    if (!this.formsValid()) {
      console.log(123);
      return;
    }

    // Parse data from form into object
    this.finalEnrollment.name = this.getName().value;
    this.finalEnrollment.comment = this.getComment().value;
    this.parseDriverAddition();
    this.finalEnrollment.additions = this.getIdsOfSelectedAdditions();

    this.initializeEnrollmentSend();
  };

  public isSelfEnrolling() {
    return this.getSelfEnrollment().value && this.userIsLoggedIn;
  }

  public getAdditionsControls() {
    return (this.form_main.get('additions') as FormArray).controls;
  }

  public getNameErrorMessage(): string {
    if (this.getName().hasError('required')) {
      return 'Bitte gebe einen Namen an';
    }

    if (this.getName().hasError('inUse')) {
      return 'Es besteht bereits eine Anmeldung mit diesem Namen';
    }
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

  public getCreatorErrorMessage(): string {
    if (this.creatorError) {
      return 'Du bist bereits angemeldet';
    }
  }

  inUseError(fColumn: any) {
    const uppercaseName = fColumn.charAt(0).toUpperCase() + fColumn.substring(1);
    const fnName: string = 'get' + uppercaseName;

    this[fnName]().setErrors({inUse: true});
    this[fnName]().markAsTouched();
  }

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

  private parseOutputIntoForm() {
    if (this.finalEnrollment.creator) {
      this.getName().setValue(this.finalEnrollment.creator.name);
    } else {
      this.getName().setValue(this.finalEnrollment.name);
    }


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

  /**
   * FORM GETTER
   * FORM GETTER
   * FORM GETTER
   */
  private disableNameInput() {
    this.getName().disable();
  }

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

  private getDriver() {
    return this.form_driverPassenger.get('driver');
  }

  private getName() {
    return this.form_main.get('name');
  }

  private getSelfEnrollment() {
    return this.form_selfEnrollment.get('selfEnrollment');
  }
}

