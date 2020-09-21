import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';
import {AuthenticationService} from '../../../../services/authentication.service';
import {IEnrollmentModel} from '../../../../models/IEnrollment.model';
import {EnrollmentModel} from '../../../../models/EnrollmentModel.model';
import {IAppointmentModel} from '../../../../models/IAppointment.model';
import {IAdditionModel} from '../../../../models/IAddition.model';
import {EnrollmentComponent} from '../enrollment.component';
import {MatStepper} from '@angular/material';

@Component({
  selector: 'app-enrollment-create',
  templateUrl: './enrollment-create.component.html',
  styleUrls: ['./enrollment-create.component.scss']
})
export class EnrollmentCreateComponent implements OnInit {
  @Input() appointment: IAppointmentModel;
  @Input() sendingRequestEmit: EventEmitter<boolean>;
  @Input() triggerDirectSend: boolean;
  @Output() execute: EventEmitter<{ operation: string, enrollment: IEnrollmentModel }> =
    new EventEmitter<{ operation: string, enrollment: IEnrollmentModel }>();
  @ViewChild('stepper', {static: true}) stepper: MatStepper;

  public userIsLoggedIn: boolean = this.authenticationService.userIsLoggedIn();
  public isSelfEnrollment = this.userIsLoggedIn;
  public showLoginAndMailForm: boolean;
  public creatorError = false;

  public form_selfEnrollment = this.formBuilder.group({
    selfEnrollment: new FormControl('true', []),
  });

  public form_main = this.formBuilder.group({
    name: new FormControl({value: '', disabled: this.isSelfEnrollment}, [Validators.required, Validators.min(2)]),
    comment: new FormControl('', [Validators.min(2)]),
  });


  public form_additions = this.formBuilder.group({
    additions: new FormArray([]),
  });

  public form_driverPassenger = this.formBuilder.group({
    driver: new FormControl(false),
    seats: new FormControl('', [Validators.min(1)]),
    requirement: new FormControl('', []),
    service: new FormControl('', [])
  });

  public finalEnrollment: IEnrollmentModel = new EnrollmentModel();

  private finalEnrollment_raw: string;
  // SELF ENROLLMENT MANAGEMENT
  private isEnrolledAsCreator;
  private oldNameValue: string = undefined;

  constructor(private formBuilder: FormBuilder, public authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    // Automatically insert username from current user
    if (this.userIsLoggedIn) {
      this.isEnrolledAsCreator = this.appointment.enrollments.some(sEnrollment =>
        sEnrollment.creator && sEnrollment.creator.username === this.authenticationService.currentUserValue.username);
      this.creatorError = this.isEnrolledAsCreator;
      this.getName().setValue(this.authenticationService.currentUserValue.name);
    }

    this.storageDataToFields();

    this.buildFormCheckboxes();

    if (this.triggerDirectSend && !this.creatorError) {
      this.initializeEnrollmentSend();
      this.stepper.selectedIndex = this.stepper.steps.length - 1;
      return;
    }
  }

  /**
   * Initialize sending of enrollment.<br/>
   * Information gathering and enrollment assigning (account or mail)
   */
  public initializeEnrollmentSend: () => void = () => {
    if (!this.finalEnrollment.editMail
      && this.userIsLoggedIn
      && !this.isSelfEnrolling()
      && !this.triggerDirectSend) {
      this.showLoginAndMailForm = true;
      return;
    }

    this.execute.emit({operation: 'create', enrollment: this.finalEnrollment});
  };

  public changeSelfEnrollment() {
    this.isSelfEnrollment = !this.isSelfEnrollment;
    if (this.isSelfEnrollment) {
      this.creatorError = this.isEnrolledAsCreator;
      this.oldNameValue = this.form_main.get('name').value;
      delete this.finalEnrollment.editMail;
      this.disableNameInput();
      this.form_main.get('name').setValue(this.authenticationService.currentUserValue.name);
    } else {
      if (this.oldNameValue) {
        this.form_main.get('name').setValue(this.oldNameValue);
      }
      this.creatorError = false;
      this.form_main.get('name').enable();
    }
  }

  public mailFormCancel() {
    this.clearLoginAndMailFormIntercepting();
    this.stepper.selectedIndex = this.stepper.steps.length - 2;
  }

  public mailFormSubmit($event: string) {
    this.finalEnrollment.editMail = $event;
    this.enrollmentAssignmentDecision();
  }

  public clearLoginAndMailFormIntercepting() {
    localStorage.removeItem(EnrollmentComponent.LOCAL_STORAGE_ENROLLMENT_TMP_KEY);

    this.showLoginAndMailForm = false;
  }

  public isSelfEnrolling() {
    return this.getSelfEnrollment().value && this.userIsLoggedIn;
  }

  public getAdditionsControls() {
    return (this.form_additions.get('additions') as FormArray).controls;
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

    this.stepper.selectedIndex = 0;
  }

  setCreatorError() {
    this.creatorError = true;
    this.isEnrolledAsCreator = true;
  }

  /**
   * Check if id of addition is checked by enrollment.
   *
   * @param enrollment IEnrollmentModel Enrollment to search in
   * @param id string ID of addition to check for
   */
  public enrollmentCheckedAddition: (enrollment: IEnrollmentModel, id: string) => boolean
    = (enrollment: IEnrollmentModel, id: string): boolean => {
    return enrollment.additions.findIndex(add => add.id === id) !== -1;
  };

  public saveMainForm() {
    this.finalEnrollment.name = this.getName().value;
    this.finalEnrollment.comment = this.getComment().value;
  }

  public saveAdditionsForm() {
    this.finalEnrollment.additions = this.getIdsOfSelectedAdditions();
  }

  public saveDriverForm() {
    this.parseDriverAddition();
  }

  /**
   * Determine if data can be send to API directly. This is the case, if the user is already logged in.
   * Otherwise, the user is asked to login with his account, or send the enrollment with his mail (for auth purposes). <br/>
   * For the possible redirect to the login page, the data needs to be stored locally, to be fetched later.
   */
  public enrollmentAssignmentDecision() {
    // If user selected selfEnrollment
    // Or if mail is set, then send enrollment

    if (this.isSelfEnrolling()
      || this.finalEnrollment.editMail) {
      this.showLoginAndMailForm = false;
      this.stepper.selectedIndex = this.stepper.steps.length - 2;
      this.initializeEnrollmentSend();
    } else {
      // not logged
      // TempStore item for possible login redirect
      localStorage.setItem(EnrollmentComponent.LOCAL_STORAGE_ENROLLMENT_TMP_KEY, JSON.stringify(this.finalEnrollment));

      this.showLoginAndMailForm = true;
      this.stepper.next();
    }
  }

  private buildFormCheckboxes: () => void = () => {
    this.appointment.additions.forEach((o) => {
      // if output has addition with this id then set to true
      let selected = false;
      if (this.finalEnrollment) {
        selected = this.finalEnrollment.additions.some(iAddition => iAddition.id === o.id);
      }
      const control = new FormControl(selected);
      (this.form_additions.controls.additions as FormArray).push(control);
    });
  };

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

  private parseOutputIntoForm() {
    if (this.finalEnrollment.creator) {
      this.getName().setValue(this.authenticationService.currentUserValue.name);
    } else {
      if (this.isSelfEnrollment) {
        if (this.finalEnrollment.name !== this.authenticationService.currentUserValue.name) {
          this.isSelfEnrollment = false;
          this.form_main.get('name').setValue(this.authenticationService.currentUserValue.name);
        } else {
          this.form_main.get('name').setValue(this.finalEnrollment.name);
        }
      } else {
        this.form_main.get('name').setValue(this.finalEnrollment.name);
      }
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
    const additionListRaw = this.form_additions.value.additions
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
