import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {EnrollmentComponent} from './enrollment.component';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatTooltipModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FetchAppointmentModule} from '../html-template/fetch-appointment/fetch-appointment.module';
import {LoadingModule} from '../../html-template/loading/loading.module';
import {LoadingDisableModule} from '../../../directives/loading-disable/loading-disable.module';
import {EnrollmentCreateModule} from './enrollment-create/enrollment-create.module';
import {EnrollmentEditModule} from './enrollment-edit/enrollment-edit.module';

const routes: Routes = [
  {
    path: 'edit',
    loadChildren: './enrollment-edit/enrollment-edit.module#EnrollmentEditModule',
  },
  {
    path: 'add',
    loadChildren: './enrollment-create/enrollment-create.module#EnrollmentCreateModule',
  },
];

@NgModule({
  declarations: [
    EnrollmentComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    MatProgressBarModule,
    FormsModule,
    MatButtonModule,
    FetchAppointmentModule,
    LoadingModule,
    LoadingDisableModule,
    MatProgressSpinnerModule,
    EnrollmentCreateModule,
    EnrollmentEditModule,
  ]
})
export class EnrollmentModule {
}
