import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OverallDataComponent} from './overall-data.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule} from '@angular/material';
import {NgxMatDatetimePickerModule} from 'ngx-mat-datetime-picker';


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
    NgxMatDatetimePickerModule,
    MatDatepickerModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ]
})
export class OverallDataModule {
}
