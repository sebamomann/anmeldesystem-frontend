import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AppointmentComponent} from '../termin/appointment.component';
import {AccountComponent} from './account.component';

const routes: Routes = [
  {path: '', component: AppointmentComponent},
  {
    path: 'login',
    loadChildren: './login/login.module#LoginModule'
  },
  {
    path: 'profile',
    loadChildren: './profile/profile.module#ProfileModule'
  }, {
    path: 'logout',
    loadChildren: './logout/logout.module#LogoutModule'
  }
];

@NgModule({
  declarations: [
    AccountComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class AccountModule {
}
