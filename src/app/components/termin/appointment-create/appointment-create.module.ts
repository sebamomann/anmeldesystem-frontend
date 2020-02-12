import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AppointmentCreateComponent} from './appointment-create.component';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatProgressBarModule,
  MatStepperModule,
  MatTooltipModule
} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxMatDatetimePickerModule} from 'ngx-mat-datetime-picker';
import {AuthGuard} from '../../../_helper/auth.guard';
import {ApplicationPipesModule} from '../../../pipes/application-pipes.module';

const routes: Routes = [
  {path: '', component: AppointmentCreateComponent, canActivate: [AuthGuard]}
];

@NgModule({
  declarations: [
    AppointmentCreateComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatStepperModule,
    ReactiveFormsModule,
    NgxMatDatetimePickerModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatIconModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatInputModule,
    MatButtonModule,
    ApplicationPipesModule,
  ],
  exports: [],
  providers: []
})
export class AppointmentCreateModule {
}
