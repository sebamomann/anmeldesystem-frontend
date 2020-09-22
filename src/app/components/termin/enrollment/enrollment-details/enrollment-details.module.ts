import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EnrollmentDetailsComponent} from './enrollment-details.component';
import {MatIconModule} from '@angular/material';


@NgModule({
  declarations: [EnrollmentDetailsComponent],
  exports: [
    EnrollmentDetailsComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule
  ]
})
export class EnrollmentDetailsModule {
}
