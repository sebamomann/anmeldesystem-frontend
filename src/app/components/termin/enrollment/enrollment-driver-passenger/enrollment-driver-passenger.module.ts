import { LoadingDisableModule } from './../../../../directives/loading-disable/loading-disable.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnrollmentDriverPassengerComponent } from './enrollment-driver-passenger.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatSelectModule } from '@angular/material';


@NgModule({
  declarations: [EnrollmentDriverPassengerComponent],
  exports: [EnrollmentDriverPassengerComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    LoadingDisableModule
  ]
})
export class EnrollmentDriverPassengerModule {
}
