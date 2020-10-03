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

  @Output('done') done__: EventEmitter<{ operation: string, enrollment: IEnrollmentModel }>
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
  mainFormValues: any;
  isEnrolledAsCreator: any;

  public enrollment: IEnrollmentModel = new EnrollmentModel();

  constructor(private formBuilder: FormBuilder, private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    // get referenced enrollment
    const enrollment: IEnrollmentModel = this.appointment.enrollments.filter(fEnrollment => {
      return fEnrollment.id === this.enrollmentId;
    })[0];

    this.mainFormValues = {};

    if (enrollment) {
      this.enrollment = enrollment;

      if (enrollment.creator) {
        // NEED
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
    if (this.enrollment.creator) {
      delete this.enrollment.name;
    }

    this.enrollment.token = this.permissionToken;

    this.done__.emit({operation: 'update', enrollment: this.enrollment});
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
    this.enrollment.name = this.getName().value;
    this.enrollment.comment = this.getComment().value;
    this.parseDriverAddition();
    this.enrollment.additions = this.getIdsOfSelectedAdditions();

    this.initializeEnrollmentSend();
  };

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

  public getDriver() {
    return this.form_driverPassenger.get('driver');
  }

  additionsFormDone($event: any) {
    const output: any = {}; // IEnrollmentModel
    output.additions = $event;
    output.id = this.enrollmentId;

    this.done__.emit({operation: 'update', enrollment: output});
  }

  cancel() {

  }

  driverFormDone($event: any) {

  }

  public mainFormDone($event: any) {
    const output = $event;
    output.id = this.enrollmentId;

    if (this.enrollment.creator) {
      delete output.name;
    }

    delete output.selfEnrollment;

    this.done__.emit({operation: 'update', enrollment: output});
  }

  private buildFormCheckboxes: () => void = () => {
    this.appointment.additions.forEach((o) => {
      // if output has addition with this id then set to true
      let selected = false;
      if (this.enrollment) {
        selected = this.enrollment.additions.some(iAddition => iAddition.id === o.id);
      }
      const control = new FormControl(selected);
      (this.form_main.controls.additions as FormArray).push(control);
    });
  };

  private parseOutputIntoForm() {
    if (this.enrollment.creator) {
      this.getName().setValue(this.enrollment.creator.name);
    } else {
      this.getName().setValue(this.enrollment.name);
    }


    this.form_main.get('comment').setValue(this.enrollment.comment);
    if (this.enrollment.driver != null) {
      this.form_driverPassenger.get('driver').setValue(this.enrollment.driver);
      this.form_driverPassenger.get('seats').setValue(this.enrollment.driver.seats);
      this.form_driverPassenger.get('service').setValue(this.enrollment.driver.service);
    }

    if (this.enrollment.passenger != null) {
      this.form_driverPassenger.get('requirement').setValue(this.enrollment.passenger.requirement);
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
        this.enrollment.driver = {
          service: this.getService().value,
          seats: this.getSeats().value,
        };
        this.enrollment.passenger = null;
      } else {
        this.enrollment.passenger = {
          requirement: this.getRequirement().value,
        };
        this.enrollment.driver = null;
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

  private getName() {
    return this.form_main.get('name');
  }
}

