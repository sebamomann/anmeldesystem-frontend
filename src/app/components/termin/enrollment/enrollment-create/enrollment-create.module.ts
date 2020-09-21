import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EnrollmentCreateComponent} from './enrollment-create.component';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
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
  ]
})
export class EnrollmentCreateModule {
}
