import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppointmentComponent} from './appointment.component';
import {EnrollmentComponent} from './enrollment/enrollment.component';
import {RouterModule, Routes} from '@angular/router';
import {
  MatBadgeModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatProgressBarModule,
  MatSelectModule,
  MatTooltipModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppointmentDataModule} from './appointment-data/appointment-data.module';
import {EnrollmentListModule} from './enrollment/enrollment-list/enrollment-list.module';
import {AppointmentModule} from './appointment.module';

const routes: Routes = [
  {path: '', pathMatch: 'full', component: AppointmentComponent},
  {path: 'add', component: EnrollmentComponent},
];


@NgModule({
  declarations: [
    EnrollmentComponent,
  ],
  exports: [],
  imports: [
    CommonModule,
    EnrollmentListModule,
    RouterModule.forChild(routes),
    MatIconModule,
    MatProgressBarModule,
    MatCardModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    MatExpansionModule,
    MatBadgeModule,
    FormsModule,
    AppointmentDataModule,
    MatInputModule,
    AppointmentModule,
    MatButtonModule
  ]
})
export class EnrollModule {
}
