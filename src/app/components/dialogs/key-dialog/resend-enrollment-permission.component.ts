import {Component, Inject, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../services/authentication.service';
import {FormBuilder, FormControl} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Router, RouterStateSnapshot} from '@angular/router';
import {IEnrollmentModel} from '../../../models/IEnrollment.model';

@Component({
  selector: 'app-key-dialog',
  templateUrl: './resend-enrollment-permission.component.html',
  styleUrls: ['./resend-enrollment-permission.component.scss']
})
export class ResendEnrollmentPermissionComponent implements OnInit {
  enrollment: IEnrollmentModel;
  userIsLoggedIn: boolean = this.authenticationService.currentUserValue !== null;

  keyEvent = this.formBuilder.group({
    key: new FormControl('', []),
    existingKey: new FormControl(),
  });

  ENROLLMENT_KEY_KEY = 'enrollmentKeys';
  localStorageKeys: string[];
  currentUrlSnapshotWithParameter: RouterStateSnapshot;
  operation: string;

  constructor(public authenticationService: AuthenticationService, private formBuilder: FormBuilder,
              public matDialogRef: MatDialogRef<ResendEnrollmentPermissionComponent>, private router: Router,
              @Inject(MAT_DIALOG_DATA) public data) {
    this.enrollment = data.enrollment;
    this.operation = data.operation;
    this.currentUrlSnapshotWithParameter = router.routerState.snapshot;
  }

  ngOnInit() {
    this.localStorageKeys = JSON.parse(localStorage.getItem(this.ENROLLMENT_KEY_KEY));
    if (this.localStorageKeys === null) {
      this.localStorageKeys = [];
    }
  }

  onNoClick() {
    this.matDialogRef.close();
  }

  setToken() {
    if (!this.keyEventValid()) {
      this.keyEvent.markAllAsTouched();
      this.getKey().setErrors({required: true});
      return;
    }

    this.matDialogRef.close(this.addKeyIfNotExisting());
  }

  // TODO DUPLICATE
  private addKeyIfNotExisting() {
    let value;
    if (this.keyEvent.get('key').value !== '') {
      value = this.keyEvent.get('key').value;
    } else {
      value = this.keyEvent.get('existingKey').value;
    }

    if (!this.localStorageKeys.includes(value)) {
      this.localStorageKeys.push(value);
    }

    localStorage.setItem(this.ENROLLMENT_KEY_KEY, JSON.stringify(this.localStorageKeys));

    return value;
  }

  public keyEventValid() {
    return this.keyEvent.get('key').value !== ''
      || this.keyEvent.get('existingKey').value !== null;
  }

  public getKeyErrorMessage(): string {
    if (this.getKey().hasError('required')) {
      return 'Bitte angeben';
    }
  }

  public getExistingKeyErrorMessage(): string {
    if (this.getKey().hasError('required')) {
      return 'Bitte auswählen';
    }
  }

  public getKeyEventErrorMessage(): string {
    if (this.keyEvent.hasError('required')) {
      return 'Bitte spezifiziere einen Token';
    }
  }

  private getKey() {
    return this.keyEvent.get('key');
  }

  private getExistingKey() {
    return this.keyEvent.get('existingKey');
  }
}
