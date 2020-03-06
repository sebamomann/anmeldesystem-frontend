import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OtherComponent} from './other.component';
import {MatButtonModule, MatCheckboxModule, MatIconModule, MatTooltipModule} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [OtherComponent],
  exports: [
    OtherComponent
  ],
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatIconModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatButtonModule
  ]
})
export class OtherModule {
}
