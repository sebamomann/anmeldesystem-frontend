import {Component, Inject, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../services/authentication.service';
import {FormBuilder} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Router, RouterStateSnapshot} from '@angular/router';
import {IEnrollmentModel} from '../../../models/IEnrollment.model';

@Component({
  selector: 'app-key-dialog',
  templateUrl: './resend-enrollment-permission.component.html',
  styleUrls: ['./resend-enrollment-permission.component.scss']
})
export class ResendEnrollmentPermissionComponent implements OnInit {
  public enrollment: IEnrollmentModel;
  public userIsLoggedIn: boolean = this.authenticationService.currentUserValue !== null;
  public currentUrlSnapshotWithParameter: RouterStateSnapshot;
  public operation: string;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              public authenticationService: AuthenticationService,
              public matDialogRef: MatDialogRef<ResendEnrollmentPermissionComponent>,
              @Inject(MAT_DIALOG_DATA) public data) {
    this.enrollment = data.enrollment;
    this.operation = data.operation;
    this.currentUrlSnapshotWithParameter = router.routerState.snapshot;
  }

  ngOnInit() {
  }

  onNoClick() {
    this.matDialogRef.close();
  }
}
