import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {OverallDataComponent} from './overall-data.component';
import {ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressSpinnerModule
} from '@angular/material';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [OverallDataComponent],
  exports: [
    OverallDataComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    RouterModule
  ],
  providers: [DatePipe,
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false}
    }]
})
export class OverallDataModule {
}
