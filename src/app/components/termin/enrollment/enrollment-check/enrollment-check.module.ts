import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EnrollmentCheckComponent} from './enrollment-check.component';
import {MatButtonModule, MatCardModule, MatDividerModule} from '@angular/material';
import {LoadingDisableModule} from '../../../../directives/loading-disable/loading-disable.module';
import {EnrollmentDetailsModule} from '../enrollment-details/enrollment-details.module';


@NgModule({
  declarations: [EnrollmentCheckComponent],
  exports: [EnrollmentCheckComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    LoadingDisableModule,
    EnrollmentDetailsModule,
    MatDividerModule
  ]
})
export class EnrollmentCheckModule {
}
