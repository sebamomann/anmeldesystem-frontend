import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard.component';
import {AuthGuard} from '../../../_helper/auth.guard';
import {MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressBarModule} from '@angular/material';
import {AppointmentDataModule} from '../appointment-data/appointment-data.module';

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
    AppointmentDataModule,
  ],
  declarations: [
    DashboardComponent,
  ],
  exports: [],
  providers: [],
})
export class DashboardModule {
}
