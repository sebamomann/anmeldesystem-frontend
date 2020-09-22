import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EnrollmentCreateComponent} from './enrollment-create.component';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDividerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatStepperModule,
  MatTooltipModule
} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {LoadingDisableModule} from '../../../../directives/loading-disable/loading-disable.module';
import {EnrollmentLoginMailModule} from '../enrollment-login-mail/enrollment-login-mail.module';
import {EnrollmentMainFormModule} from '../enrollment-main-form/enrollment-main-form.module';
import {EnrollmentDetailsModule} from '../enrollment-details/enrollment-details.module';


@NgModule({
  declarations: [EnrollmentCreateComponent],
  exports: [
    EnrollmentCreateComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    RouterModule,
    MatButtonModule,
    LoadingDisableModule,
    EnrollmentLoginMailModule,
    MatStepperModule,
    EnrollmentMainFormModule,
    MatDividerModule,
    EnrollmentDetailsModule,
  ]
})
export class EnrollmentCreateModule {
}
