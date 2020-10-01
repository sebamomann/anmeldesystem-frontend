import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {AuthenticationService} from '../../../../services/authentication.service';
import {IEnrollmentModel} from '../../../../models/IEnrollment.model';
import {EnrollmentModel} from '../../../../models/EnrollmentModel.model';
import {IAppointmentModel} from '../../../../models/IAppointment.model';
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

  public finalEnrollment: IEnrollmentModel = new EnrollmentModel();
  public mainFormValues: any;
  public isEnrolledAsCreator: boolean;

  doneForms = {overall: false, additions: false, driver: false};

  private finalEnrollment_raw: string;
  private creatorError: boolean;
  private selfEnrollment: any;

  constructor(public authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    if (this.userIsLoggedIn) {
      this.isEnrolledAsCreator = this.appointment.enrollments.some(sEnrollment =>
        sEnrollment.creator && sEnrollment.creator.username === this.authenticationService.currentUserValue.username);
      this.creatorError = this.isEnrolledAsCreator;
    }

    this.storageDataToFields();

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

  public inUseError(fColumn: any) {
    const uppercaseName = fColumn.charAt(0).toUpperCase() + fColumn.substring(1);
    const fnName: string = 'set' + uppercaseName + 'Error';

    this[fnName]();
  }

  public setCreatorError() {
    this.mainFormRef.setCreatorError();
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

      setTimeout(() => {
        this.stepper.next();
      });
    }
  }

  public mainFormDone(val: any) {
    this.doneForms.overall = true;

    this.finalEnrollment.name = val.name;
    this.finalEnrollment.comment = val.comment;
    this.selfEnrollment = val.selfEnrollment;

    if (val.selfEnrollment) {
      this.finalEnrollment.creator = {} as any;
      this.finalEnrollment.creator.name = this.authenticationService.currentUserValue.name;
      this.finalEnrollment.creator.username = this.authenticationService.currentUserValue.username;
    }

    setTimeout(() => {
      this.stepper.next();
    });
  }

  public additionsFormDone(val) {
    this.finalEnrollment.additions = val;

    setTimeout(() => {
      this.stepper.next();
    });
  }

  public driverFormDone($event) {
    this.doneForms.driver = true;

    this.finalEnrollment.driver = $event.driver;
    this.finalEnrollment.passenger = $event.passenger;

    setTimeout(() => {
      this.stepper.next();
    });
  }

  public setSelfEnrollment(val: boolean) {
    if (val) {
      delete this.finalEnrollment.editMail;
    }

    this.selfEnrollment = val;
  }

  public stepperPrevious() {
    this.stepper.previous();
  }

  // @ts-ignore // dynamic call
  private setNameError() {
    this.stepper.selectedIndex = 0;
    this.mainFormRef.setNameError();
  }

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
  }
}
