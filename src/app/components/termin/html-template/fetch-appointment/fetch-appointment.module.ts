import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FetchAppointmentComponent} from './fetch-appointment.component';
import {MatCardModule, MatProgressBarModule} from '@angular/material';


@NgModule({
  declarations: [FetchAppointmentComponent],
  exports: [
    FetchAppointmentComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule
  ]
})
export class FetchAppointmentModule {
}
