import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {EnrollmentComponent} from './enrollment.component';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatTooltipModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FetchAppointmentModule} from '../html-template/fetch-appointment/fetch-appointment.module';
import {LoadingModule} from '../../html-template/loading/loading.module';
import {LoadingDisableModule} from '../../../directives/loading-disable/loading-disable.module';
import {EnrollmentLoginMailComponent} from './enrollment-login-mail/enrollment-login-mail.component';

const routes: Routes = [
  {path: '', component: EnrollmentComponent},
];

@NgModule({
  declarations: [
    EnrollmentComponent,
    EnrollmentLoginMailComponent,
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
    MatExpansionModule,
    MatProgressBarModule,
    FormsModule,
    MatButtonModule,
    FetchAppointmentModule,
    LoadingModule,
    LoadingDisableModule,
    MatProgressSpinnerModule,
  ]
})
export class EnrollmentModule {
}
