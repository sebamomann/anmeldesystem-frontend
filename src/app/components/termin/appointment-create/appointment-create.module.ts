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
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatProgressBarModule,
  MatStepperModule,
  MatTooltipModule
} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxMatDatetimePickerModule} from 'ngx-mat-datetime-picker';
import {AuthGuard} from '../../../_helper/auth.guard';
import {ApplicationPipesModule} from '../../../pipes/application-pipes.module';
import {TemplateDialogComponent} from '../../dialogs/template-dialog/template-dialog.component';

const routes: Routes = [
  {path: '', component: AppointmentCreateComponent, canActivate: [AuthGuard]}
];

@NgModule({
  declarations: [
    AppointmentCreateComponent,
    TemplateDialogComponent
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
    MatDialogModule,
    MatListModule,
  ],
  exports: [
    TemplateDialogComponent
  ],
  providers: []
})
export class AppointmentCreateModule {
}
