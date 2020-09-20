import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EnrollmentLoginMailComponent} from './enrollment-login-mail.component';
import {MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatTooltipModule} from '@angular/material';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [EnrollmentLoginMailComponent],
  exports: [
    EnrollmentLoginMailComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class EnrollmentLoginMailModule {
}
