import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserDataComponent} from './user-data.component';
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatTooltipModule
} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [UserDataComponent],
  exports: [
    UserDataComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    RouterModule,
    MatCardModule,
    MatProgressSpinnerModule
  ]
})
export class UserDataModule {
}
