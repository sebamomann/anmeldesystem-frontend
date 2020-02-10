import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard.component';
import {AppointmentDataComponent} from '../appointment-data/appointment-data.component';
import {AuthGuard} from '../../../_helper/auth.guard';
import {MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressBarModule} from '@angular/material';

const routes: Routes = [
  {path: '', component: DashboardComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatProgressBarModule,
  ],
  declarations: [
    DashboardComponent,
    AppointmentDataComponent
  ],
  exports: [
    AppointmentDataComponent
  ],
  providers: [],
})
export class DashboardModule {
}
