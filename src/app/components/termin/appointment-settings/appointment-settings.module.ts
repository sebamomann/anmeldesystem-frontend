import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppointmentSettingsComponent} from './appointment-settings.component';
import {RouterModule, Routes} from '@angular/router';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatTabsModule,
  MatTooltipModule
} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxMatDatetimePickerModule} from 'ngx-mat-datetime-picker';

const routes: Routes = [
  {path: '', component: AppointmentSettingsComponent}
];

@NgModule({
  declarations: [AppointmentSettingsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTabsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    NgxMatDatetimePickerModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
  ]
})
export class AppointmentSettingsModule {
}
