import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OtherComponent} from './other.component';
import {MatButtonModule, MatCardModule, MatCheckboxModule, MatIconModule, MatTooltipModule} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';


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
    MatButtonModule,
    MatCardModule,
    RouterModule
  ]
})
export class OtherModule {
}
