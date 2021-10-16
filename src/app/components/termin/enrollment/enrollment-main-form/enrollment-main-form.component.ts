import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {AuthenticationService} from '../../../../services/authentication.service';
import {IAppointmentModel} from '../../../../models/IAppointment.model';
import {IEnrollmentModel} from '../../../../models/IEnrollment.model';
import {EnrollmentModel} from '../../../../models/EnrollmentModel.model';
import {AuthenticationValuesService} from '../../../../services/authentication.values.service';

@Component({
  selector: 'app-enrollment-main-form',
  templateUrl: './enrollment-main-form.component.html',
  styleUrls: ['./enrollment-main-form.component.scss']
})
export class EnrollmentMainFormComponent implements OnInit, OnChanges {
  @Output() done = new EventEmitter();

  @Input() appointment: IAppointmentModel;
  @Input() enrollment: IEnrollmentModel;
  @Input() isEdit = false;
  @Input() directSend: boolean;
  @Input() isEnrolledAsCreator: boolean;

  public userIsLoggedIn: boolean = this.authenticationService.userIsLoggedIn();
  public isSelfEnrollment = this.userIsLoggedIn;

  // SELF ENROLLMENT VARS
  public creatorError = false;

  public form = this.formBuilder.group({
    name: new FormControl({
      value: '',
      disabled: this.isSelfEnrollment || (this.enrollment && this.enrollment.creator)
    }, [Validators.required, Validators.min(2)]),
    comment: new FormControl('', [Validators.min(2)]),
  });

  public form_selfEnrollment = this.formBuilder.group({
    selfEnrollment: new FormControl(this.isSelfEnrollment, []),
  });

  // SELF ENROLLMENT VARS
  private oldNameValue: string = undefined;

  constructor(private formBuilder: FormBuilder, private authenticationService: AuthenticationService,
              private authenticationValuesService: AuthenticationValuesService) {
  }

  ngOnInit() {
    this.creatorError = this.isEnrolledAsCreator;

    this.fillFormValues();
  }

  public setSelfEnrollment() {
    if (this.isSelfEnrollment) {
      this.creatorError = this.isEnrolledAsCreator;
      this.oldNameValue = this.getFormControl('name').value;
      this.disableNameInput();
      this.getFormControl('name').setValue(this.authenticationValuesService.currentUserSubject$.getValue().name);
    } else {
      if (this.oldNameValue) {
        this.getFormControl('name').setValue(this.oldNameValue);
      }
      this.creatorError = false;
      this.getFormControl('name').enable();
    }
  }

  public changeSelfEnrollment() {
    this.isSelfEnrollment = !this.isSelfEnrollment;

    this.setSelfEnrollment();
  }

  public save() {
    let creator;

    if (this.form.valid) {
      if (this.isSelfEnrollment && !this.isEdit) {
        creator = {} as any;
        creator.name = this.authenticationValuesService.currentUserSubject$.getValue().name;
        creator.username = this.authenticationValuesService.currentUserSubject$.getValue().preferred_username;
      }

      this.done.emit({
        name: this.getFormControl('name').value,
        comment: this.getFormControl('comment').value,
        selfEnrollment: this.getSelfEnrollment().value,
        creator
      });
    }
  }

  public getNameErrorMessage(): string {
    if (this.getFormControl('name').hasError('required')) {
      return 'Bitte gebe einen Namen an';
    } else if (this.getFormControl('name').hasError('inUse')) {
      return 'Es besteht bereits eine Anmeldung mit diesem Namen';
    }
  }

  public getCreatorErrorMessage(): string {
    if (this.creatorError) {
      return 'Du bist bereits angemeldet';
    }
  }

  public setNameInUseError() {
    this.getFormControl('name').setErrors({inUse: true});
  }

  public setCreatorError() {
    this.creatorError = true;
    this.isEnrolledAsCreator = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.directSend) {
      this.isSelfEnrollment = true;

      this.setSelfEnrollment();
    }
  }

  private fillFormValues() {
    this.isSelfEnrollment = this.enrollment.selfEnrollment ? this.enrollment.selfEnrollment : this.userIsLoggedIn;
    this.getSelfEnrollment().setValue(this.isSelfEnrollment ? this.isSelfEnrollment : this.userIsLoggedIn);

    if (JSON.stringify(new EnrollmentModel()) !== JSON.stringify(this.enrollment)) {
      if (this.enrollment.creator) {
        this.getFormControl('name').setValue(this.enrollment.creator.name);
        this.disableNameInput();
      } else if (this.directSend) {
        this.getFormControl('name').setValue(this.authenticationValuesService.currentUserSubject$.getValue().name);
      } else {
        if (this.isEdit) {
          this.enableNameInput();
        }

        this.getFormControl('name').setValue(this.enrollment.name);
      }

      this.getFormControl('comment').setValue(this.enrollment.comment);
    } else {
      if (this.userIsLoggedIn && this.isSelfEnrollment) {
        this.getFormControl('name').setValue(this.authenticationValuesService.currentUserSubject$.getValue().name);
        this.disableNameInput();
      }
    }
  }

  private getFormControl(str: string) {
    return this.form.get(str);
  }

  private getSelfEnrollment() {
    return this.form_selfEnrollment.get('selfEnrollment');
  }

  private disableNameInput() {
    this.getFormControl('name').disable();
  }

  private enableNameInput() {
    this.getFormControl('name').enable();
  }
}
