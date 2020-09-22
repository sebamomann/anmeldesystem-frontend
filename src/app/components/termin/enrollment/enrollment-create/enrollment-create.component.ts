import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';
import {AuthenticationService} from '../../../../services/authentication.service';
import {IEnrollmentModel} from '../../../../models/IEnrollment.model';
import {EnrollmentModel} from '../../../../models/EnrollmentModel.model';
import {IAppointmentModel} from '../../../../models/IAppointment.model';
import {IAdditionModel} from '../../../../models/IAddition.model';
import {EnrollmentComponent} from '../enrollment.component';
import {MatStepper} from '@angular/material';
import {EnrollmentMainFormComponent} from '../enrollment-main-form/enrollment-main-form.component';

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
  @ViewChild('mainForm', {static: true}) mainFormRef: EnrollmentMainFormComponent;

  public userIsLoggedIn: boolean = this.authenticationService.userIsLoggedIn();

  public showLoginAndMailForm: boolean;

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
  public mainFormValues: any;
  public isEnrolledAsCreator: boolean;
  private finalEnrollment_raw: string;
  private creatorError: boolean;
  private selfEnrollment: any;

  constructor(private formBuilder: FormBuilder, public authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    if (this.userIsLoggedIn) {
      this.isEnrolledAsCreator = this.appointment.enrollments.some(sEnrollment =>
        sEnrollment.creator && sEnrollment.creator.username === this.authenticationService.currentUserValue.username);
      this.creatorError = this.isEnrolledAsCreator;
    }

    this.storageDataToFields();

    this.buildFormCheckboxes();

    if (this.triggerDirectSend && this.userIsLoggedIn) {
      this.selfEnrollment = true;
      this.finalEnrollment.name = this.authenticationService.currentUserValue.name;
      this.mainFormValues.name = this.authenticationService.currentUserValue.name;
      this.mainFormValues.selfEnrollment = this.selfEnrollment;
    }

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


    this.clearLoginAndMailFormIntercepting();
    this.execute.emit({operation: 'create', enrollment: this.finalEnrollment});
  };

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
    return this.selfEnrollment;
  }

  public getAdditionsControls() {
    return (this.form_additions.get('additions') as FormArray).controls;
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

  inUseError(fColumn: any) {
    const uppercaseName = fColumn.charAt(0).toUpperCase() + fColumn.substring(1);
    const fnName: string = 'set' + uppercaseName + 'Error';

    this[fnName]();
  }

  public setCreatorError() {
    this.mainFormRef.setCreatorError();
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
      this.finalEnrollment.selfEnrollment = this.selfEnrollment;
      localStorage.setItem(EnrollmentComponent.LOCAL_STORAGE_ENROLLMENT_TMP_KEY, JSON.stringify(this.finalEnrollment));

      this.showLoginAndMailForm = true;
      this.stepper.next();
    }
  }

  public mainFormDone(val: any) {
    this.finalEnrollment.name = val.name;
    this.finalEnrollment.comment = val.comment;
    this.selfEnrollment = val.selfEnrollment;

    if (val.selfEnrollment) {
      this.finalEnrollment.creator = {} as any;
      this.finalEnrollment.creator.name = this.authenticationService.currentUserValue.name;
      this.finalEnrollment.creator.username = this.authenticationService.currentUserValue.username;
    }

    this.stepper.next();
  }

  public setSelfEnrollment(val: boolean) {
    if (val) {
      delete this.finalEnrollment.editMail;
    }

    this.selfEnrollment = val;
  }

  public getDriver() {
    return this.form_driverPassenger.get('driver');
  }

  // @ts-ignore // dynamic call
  private setNameError() {
    this.stepper.selectedIndex = 0;
    this.mainFormRef.setNameError();
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
    const mainFormValues: any = {}; // TODO INTERFACE
    mainFormValues.selfEnrollment = this.finalEnrollment.selfEnrollment;

    if (this.finalEnrollment.creator) {
      mainFormValues.name = this.authenticationService.currentUserValue.name;
    } else {
      if (this.isSelfEnrolling()) {
        if (this.finalEnrollment.name !== this.authenticationService.currentUserValue.name) {
          this.selfEnrollment = false;
          mainFormValues.selfEnrollment = false;
          mainFormValues.name = this.authenticationService.currentUserValue.name;
        } else {
          mainFormValues.name = this.finalEnrollment.name;
        }
      } else {
        mainFormValues.name = this.finalEnrollment.name;
      }
    }

    mainFormValues.comment = this.finalEnrollment.comment;
    this.mainFormValues = mainFormValues;

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
  private getSeats() {
    return this.form_driverPassenger.get('seats');
  }

  private getRequirement() {
    return this.form_driverPassenger.get('requirement');
  }

  private getService() {
    return this.form_driverPassenger.get('service');
  }
}
