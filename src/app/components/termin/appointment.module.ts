import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppointmentComponent} from './appointment.component';
import {EnrollmentListModule} from './enrollment/enrollment-list/enrollment-list.module';
import {AppointmentDataModule} from './appointment-data/appointment-data.module';
import {MatIconModule, MatProgressBarModule} from '@angular/material';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', component: AppointmentComponent},
];

@NgModule({
  declarations: [
    AppointmentComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AppointmentDataModule,
    EnrollmentListModule,
    MatIconModule,
    RouterModule,
    MatProgressBarModule,

  ]
})
export class AppointmentModule {
}
