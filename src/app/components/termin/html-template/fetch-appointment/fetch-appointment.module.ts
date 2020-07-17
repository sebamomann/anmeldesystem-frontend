import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FetchAppointmentComponent} from './fetch-appointment.component';
import {MatButtonModule, MatCardModule, MatProgressBarModule} from '@angular/material';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [FetchAppointmentComponent],
  exports: [
    FetchAppointmentComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule,
    RouterModule,
    MatButtonModule
  ]
})
export class FetchAppointmentModule {
}
