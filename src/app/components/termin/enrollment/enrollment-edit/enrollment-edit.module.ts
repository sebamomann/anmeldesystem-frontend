import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EnrollmentEditComponent} from './enrollment-edit.component';
import {MatButtonModule, MatCardModule, MatCheckboxModule, MatInputModule, MatSelectModule} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';
import {LoadingDisableModule} from '../../../../directives/loading-disable/loading-disable.module';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [EnrollmentEditComponent],
  exports: [
    EnrollmentEditComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatButtonModule,
    LoadingDisableModule,
    RouterModule
  ]
})
export class EnrollmentEditModule {
}
