import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EnrollmentMainFormComponent} from './enrollment-main-form.component';
import {ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatTooltipModule
} from '@angular/material';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [EnrollmentMainFormComponent],
  exports: [
    EnrollmentMainFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
    MatButtonModule
  ]
})
export class EnrollmentMainFormModule {
}
