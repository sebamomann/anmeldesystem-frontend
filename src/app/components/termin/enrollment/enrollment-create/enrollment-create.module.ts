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
import {RouterModule, Routes} from '@angular/router';
import {LoadingDisableModule} from '../../../../directives/loading-disable/loading-disable.module';
import {EnrollmentLoginMailModule} from '../enrollment-login-mail/enrollment-login-mail.module';
import {EnrollmentMainFormModule} from '../enrollment-main-form/enrollment-main-form.module';
import {EnrollmentDetailsModule} from '../enrollment-details/enrollment-details.module';
import {EnrollmentAdditionsModule} from '../enrollment-additions/enrollment-additions.module';
import {EnrollmentDriverPassengerModule} from '../enrollment-driver-passenger/enrollment-driver-passenger.module';
import {EnrollmentCheckModule} from '../enrollment-check/enrollment-check.module';
import {LoadingModule} from '../../../html-template/loading/loading.module';
import {FetchAppointmentModule} from '../../html-template/fetch-appointment/fetch-appointment.module';
import {SEOService} from '../../../../_helper/_seo.service';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: EnrollmentCreateComponent,
  },
];

@NgModule({
  declarations: [EnrollmentCreateComponent],
  exports: [
    EnrollmentCreateComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
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
    EnrollmentAdditionsModule,
    EnrollmentDriverPassengerModule,
    EnrollmentCheckModule,
    LoadingModule,
    FetchAppointmentModule,
  ],
  providers: [
    SEOService
  ]
})
export class EnrollmentCreateModule {
}
