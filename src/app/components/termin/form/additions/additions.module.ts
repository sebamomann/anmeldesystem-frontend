import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdditionsComponent} from './additions.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatTooltipModule} from '@angular/material';


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
    MatButtonModule
  ]
})
export class AdditionsModule {
}
