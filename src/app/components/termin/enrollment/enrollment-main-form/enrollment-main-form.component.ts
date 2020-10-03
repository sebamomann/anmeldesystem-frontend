import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {AuthenticationService} from '../../../../services/authentication.service';
import {IAppointmentModel} from '../../../../models/IAppointment.model';

@Component({
  selector: 'app-enrollment-main-form',
  templateUrl: './enrollment-main-form.component.html',
  styleUrls: ['./enrollment-main-form.component.scss']
})
export class EnrollmentMainFormComponent implements OnInit, OnChanges {

  @Output() done = new EventEmitter();
  @Output() selfEnrollmentChange = new EventEmitter();

  @Input() appointment: IAppointmentModel;
  @Input() isEnrolledAsCreator: boolean;
  @Input() values: any;
  @Input() isEdit = false;

  public userIsLoggedIn: boolean = this.authenticationService.userIsLoggedIn();
  public isSelfEnrollment = this.userIsLoggedIn;

  // SELF ENROLLMENT VARS
  public creatorError = false;

  public form = this.formBuilder.group({
    name: new FormControl({value: '', disabled: this.isSelfEnrollment}, [Validators.required, Validators.min(2)]),
    comment: new FormControl('', [Validators.min(2)]),
  });

  public form_selfEnrollment = this.formBuilder.group({
    selfEnrollment: new FormControl(this.isSelfEnrollment, []),
  });

  // SELF ENROLLMENT VARS
  private oldNameValue: string = undefined;

  constructor(private formBuilder: FormBuilder, private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.creatorError = this.isEnrolledAsCreator;
    if (this.userIsLoggedIn && this.isSelfEnrollment) {
      this.getName().setValue(this.authenticationService.currentUserValue.name);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.values) {
      // tslint:disable-next-line:no-unused-expression
      this.values.name && this.getName().setValue(this.values.name);
      // tslint:disable-next-line:no-unused-expression
      this.values.comment && this.getComment().setValue(this.values.comment);

      this.isSelfEnrollment = this.values.selfEnrollment;
      this.getSelfEnrollment().setValue(this.isSelfEnrollment);

      this.setSelfEnrollment();
    }
  }

  public setSelfEnrollment() {
    if (this.isSelfEnrollment) {
      this.creatorError = this.isEnrolledAsCreator;
      this.oldNameValue = this.form.get('name').value;
      this.selfEnrollmentChange.emit(true);
      this.disableNameInput();
      this.form.get('name').setValue(this.authenticationService.currentUserValue.name);
    } else {
      if (this.oldNameValue) {
        this.form.get('name').setValue(this.oldNameValue);
      }
      this.selfEnrollmentChange.emit(false);
      this.creatorError = false;
      this.form.get('name').enable();
    }
  }

  public changeSelfEnrollment() {
    this.isSelfEnrollment = !this.isSelfEnrollment;
    this.setSelfEnrollment();
  }

  public save() {
    if (this.form.valid) {
      this.done.emit({
        name: this.getName().value,
        comment: this.getComment().value,
        selfEnrollment: this.getSelfEnrollment().value,
      });
    }
  }

  public getNameErrorMessage(): string {
    if (this.getName().hasError('required')) {
      return 'Bitte gebe einen Namen an';
    } else if (this.getName().hasError('inUse')) {
      return 'Es besteht bereits eine Anmeldung mit diesem Namen';
    }
  }

  public getCreatorErrorMessage(): string {
    if (this.creatorError) {
      return 'Du bist bereits angemeldet';
    }
  }

  public setNameError() {
    this.getName().setErrors({inUse: true});
  }

  public setCreatorError() {
    this.creatorError = true;
    this.isEnrolledAsCreator = true;
  }

  private getName() {
    return this.form.get('name');
  }

  private getComment() {
    return this.form.get('comment');
  }

  private getSelfEnrollment() {
    return this.form_selfEnrollment.get('selfEnrollment');
  }

  private disableNameInput() {
    this.getName().disable();
  }
}
