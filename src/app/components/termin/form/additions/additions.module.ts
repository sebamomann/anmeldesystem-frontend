import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdditionsComponent} from './additions.component';
import {ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDividerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatTooltipModule
} from '@angular/material';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [AdditionsComponent],
  exports: [
    AdditionsComponent,
    AdditionsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    RouterModule
  ]
})
export class AdditionsModule {
}
