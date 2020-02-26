import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppointmentComponent} from './appointment.component';
import {EnrollmentListModule} from './enrollment/enrollment-list/enrollment-list.module';
import {AppointmentDataModule} from './appointment-data/appointment-data.module';
import {MatIconModule, MatProgressBarModule} from '@angular/material';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../_helper/auth.guard';

const routes: Routes = [
  {path: '', component: AppointmentComponent},
  {
    path: 'settings',
    loadChildren: './appointment-settings/appointment-settings.module#AppointmentSettingsModule',
    canActivate: [AuthGuard]
  },
  {path: 'driver', loadChildren: './driver/driver.module#DriverModule'}
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
