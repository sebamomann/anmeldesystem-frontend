import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {LandingPageComponent} from './components/landing-page/landing-page.component';
import {AppointmentCreateComponent} from './components/termin/appointment-create/appointment-create.component';

import {AuthGuard} from './_helper/auth.guard';

const routes: Routes = [
  {path: '', pathMatch: 'full', component: LandingPageComponent},
  {path: 'account', loadChildren: './components/account/account.module#AccountModule'},
  {path: 'dashboard', loadChildren: './components/termin/dashboard/dashboard.module#DashboardModule'},
  {path: 'release', loadChildren: './components/releasenotes/releasenotes.module#ReleasenotesModule'},
  {path: 'create', component: AppointmentCreateComponent, canActivate: [AuthGuard]},
  {
    path: 'appointment', children: [
      {path: 'driver', loadChildren: './components/termin/driver/driver.module#DriverModule'},
    ]
  },
  {
    path: 'enroll', loadChildren: './components/termin/enroll.module#EnrollModule'
  },

  // {path: 'enrollment', pathMatch: 'full', component: EnrollmentComponent, data: {edit: true}},
  // {path: ':link', component: AppointmentComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
