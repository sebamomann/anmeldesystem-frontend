import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppointmentComponent} from './appointment.component';
import {EnrollmentListModule} from './enrollment/enrollment-list/enrollment-list.module';
import {AppointmentDataModule} from './appointment-data/appointment-data.module';
import {MatButtonModule, MatCardModule, MatIconModule} from '@angular/material';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../_helper/auth.guard';
import {FetchAppointmentModule} from './html-template/fetch-appointment/fetch-appointment.module';
import {LoadingModule} from '../html-template/loading/loading.module';
import {AutoLoadOnWsCallModule} from '../settings/auto-load-on-ws-call/auto-load-on-ws-call.module';
import {ServiceWorkerModule} from '@angular/service-worker';

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
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: true, registrationStrategy: 'registerImmediately'}),
    AppointmentDataModule,
    EnrollmentListModule,
    MatIconModule,
    RouterModule,
    MatCardModule,
    FetchAppointmentModule,
    LoadingModule,
    MatButtonModule,
    AutoLoadOnWsCallModule,
  ],
  providers: []
})
export class AppointmentModule {
}
