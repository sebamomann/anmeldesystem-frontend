import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AppointmentCreateComponent} from './appointment-create.component';
import {MatButtonModule, MatCardModule, MatIconModule, MatProgressBarModule, MatStepperModule} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';
import {AuthGuard} from '../../../_helper/auth.guard';
import {OverallDataModule} from '../form/overall-data/overall-data.module';
import {AdditionsModule} from '../form/additions/additions.module';
import {LinkDataModule} from '../form/link-data/link-data.module';

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
    OverallDataModule,
    AdditionsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatProgressBarModule,
    LinkDataModule,
  ],
  exports: [],
  providers: []
})
export class AppointmentCreateModule {
}
