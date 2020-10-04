import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {IAppointmentModel} from '../../../../models/IAppointment.model';
import {IEnrollmentModel} from '../../../../models/IEnrollment.model';
import {EnrollmentModel} from '../../../../models/EnrollmentModel.model';
import {AuthenticationService} from '../../../../services/authentication.service';
import {EnrollmentMainFormComponent} from '../enrollment-main-form/enrollment-main-form.component';
import {Router} from '@angular/router';

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

  @ViewChild('mainForm', {static: true}) mainFormRef: EnrollmentMainFormComponent;

  public userIsLoggedIn: boolean = this.authenticationService.userIsLoggedIn();
  public mainFormValues: any; // TODO
  public isEnrolledAsCreator: any;

  public enrollmentGone = false;

  public enrollment: IEnrollmentModel = new EnrollmentModel();
  public selectedIndex = 0;

  constructor(private authenticationService: AuthenticationService, private router: Router) {
  }

  ngOnInit() {
    const enrollment: IEnrollmentModel = this.appointment.enrollments.filter(fEnrollment => {
      return fEnrollment.id === this.enrollmentId;
    })[0];

    this.mainFormValues = {};

    if (enrollment) {
      this.enrollment = enrollment;
    } else {
      this.enrollmentGone = true;
    }
  }

  /**
   * MainFormComponent value emit listener.<br/>
   * Emits changed values to enrollment component.<br/>
   *
   * @param $event Object containing data from child
   */
  public mainFormDone($event: any) {
    const output = $event;
    output.id = this.enrollmentId;

    if (this.enrollment.creator) {
      delete output.name;
    }

    delete output.selfEnrollment;

    this.done__.emit({operation: 'update', enrollment: output});
  }

  /**
   * AdditionsComponent value emit listener.<br/>
   * Emits changed values to enrollment component.<br/>
   *
   * @param $event Object containing data from child
   */
  public additionsFormDone($event: any) {
    const output: any = {}; // IEnrollmentModel
    output.additions = $event;
    output.id = this.enrollmentId;

    this.done__.emit({operation: 'update', enrollment: output});
  }

  /**
   * DriverPassengerComponent value emit listener.<br/>
   * Emits changed values to enrollment component.<br/>
   *
   * @param $event Object containing data from child
   */
  public driverFormDone($event: any) {
    const output: any = {};

    output.id = this.enrollmentId;
    output.driver = $event.driver;
    output.passenger = $event.passenger;

    this.done__.emit({operation: 'update', enrollment: output});
  }

  /**
   * On cancel button click navigate back to appointment overview.
   */
  public cancel() {
    this.router.navigate(['/account/profile'], {
      queryParams: {
        a: this.appointment.link
      }
    });
  }

  /**
   * Set error for used Input value.
   * e.G. Name <br/>
   * Call error setting function that manages function call of child component
   *
   * @param fColumn String Name of column that hase a duplicate value
   */
  public inUseError(fColumn: any) {
    const uppercaseName = fColumn.charAt(0).toUpperCase() + fColumn.substring(1);
    const fnName: string = 'set' + uppercaseName + 'Error';

    this[fnName]();
  }

  /**
   * Pass Error to appropriate child component.<br/>
   * Calls name error function of component
   */
  // @ts-ignore // dynamic call
  private setNameError() {
    this.selectedIndex = 0;
    this.mainFormRef.setNameError();
  }
}

