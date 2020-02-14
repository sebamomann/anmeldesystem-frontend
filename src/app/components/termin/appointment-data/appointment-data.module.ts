import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppointmentDataComponent} from './appointment-data.component';
import {MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressBarModule} from '@angular/material';
import {RouterModule} from '@angular/router';
import {EnrollmentListModule} from '../enrollment/enrollment-list/enrollment-list.module';


@NgModule({
  declarations: [AppointmentDataComponent],
  exports: [
    AppointmentDataComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressBarModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    EnrollmentListModule,
  ]
})
export class AppointmentDataModule {
}