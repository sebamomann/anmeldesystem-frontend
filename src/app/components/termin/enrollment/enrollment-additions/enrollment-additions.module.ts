import { LoadingDisableModule } from './../../../../directives/loading-disable/loading-disable.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnrollmentAdditionsComponent } from './enrollment-additions.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatCheckboxModule } from '@angular/material';


@NgModule({
  declarations: [EnrollmentAdditionsComponent],
  exports: [
    EnrollmentAdditionsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    LoadingDisableModule
  ]
})
export class EnrollmentAdditionsModule {
}
