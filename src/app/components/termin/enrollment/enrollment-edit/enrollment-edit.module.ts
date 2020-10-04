import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EnrollmentEditComponent} from './enrollment-edit.component';
import {MatButtonModule, MatCardModule, MatCheckboxModule, MatInputModule, MatSelectModule, MatTabsModule} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';
import {LoadingDisableModule} from '../../../../directives/loading-disable/loading-disable.module';
import {RouterModule, Routes} from '@angular/router';
import {EnrollmentMainFormModule} from '../enrollment-main-form/enrollment-main-form.module';
import {EnrollmentAdditionsModule} from '../enrollment-additions/enrollment-additions.module';
import {EnrollmentDriverPassengerModule} from '../enrollment-driver-passenger/enrollment-driver-passenger.module';

const routes: Routes = [
  {
    path: '',
    component: EnrollmentEditComponent,
  },
];

@NgModule({
  declarations: [EnrollmentEditComponent],
  exports: [
    EnrollmentEditComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatButtonModule,
    LoadingDisableModule,
    RouterModule,
    MatTabsModule,
    EnrollmentMainFormModule,
    EnrollmentAdditionsModule,
    EnrollmentDriverPassengerModule
  ]
})
export class EnrollmentEditModule {
}
