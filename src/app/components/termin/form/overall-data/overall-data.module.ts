import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {OverallDataComponent} from './overall-data.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule} from '@angular/material';


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
    MatProgressSpinnerModule
  ],
  providers: [DatePipe]
})
export class OverallDataModule {
}
