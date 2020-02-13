import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {EnrollmentListModule} from './enrollment/enrollment-list/enrollment-list.module';

const routes: Routes = [
  {path: '', pathMatch: 'full', loadChildren: './appointment.module#AppointmentModule'},
  {path: 'add', loadChildren: './enrollment/enrollment.module#EnrollmentModule'},
];


@NgModule({
  declarations: [],
  exports: [],
  imports: [
    CommonModule,
    EnrollmentListModule,
    RouterModule.forChild(routes),
  ]
})
export class EnrollModule {
}
