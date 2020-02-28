import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EmailChangeComponent} from './email-change.component';
import {MatCardModule, MatProgressSpinnerModule} from '@angular/material';


@NgModule({
  declarations: [EmailChangeComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule
  ]
})
export class EmailChangeModule {
}
