import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {DriverComponent} from './driver.component';
import {MatButtonModule, MatCardModule, MatIconModule, MatProgressBarModule} from '@angular/material';
import {FetchAppointmentModule} from '../html-template/fetch-appointment/fetch-appointment.module';
import {LoadingModule} from '../../html-template/loading/loading.module';

const routes: Routes = [
  {path: '', component: DriverComponent}
];


@NgModule({
  declarations: [
    DriverComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatButtonModule,
    FetchAppointmentModule,
    LoadingModule,
  ]
})
export class DriverModule {
}
