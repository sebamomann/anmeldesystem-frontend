import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', pathMatch: 'full', loadChildren: './components/landing-page/landing-page.module#LandingPageModule'},
  {path: 'account', loadChildren: './components/account/account.module#AccountModule'},
  {path: 'dashboard', loadChildren: './components/termin/dashboard/dashboard.module#DashboardModule'},
  {path: 'release', loadChildren: './components/releasenotes/releasenotes.module#ReleasenotesModule'},
  {path: 'create', loadChildren: './components/termin/appointment-create/appointment-create.module#AppointmentCreateModule'},
  {
    path: 'appointment', children: [
      {path: 'driver', loadChildren: './components/termin/driver/driver.module#DriverModule'},
    ]
  },
  {path: 'enroll', loadChildren: './components/termin/enroll.module#EnrollModule'},
  {
    path: 'enrollment',
    pathMatch: 'full',
    loadChildren: './components/termin/enrollment/enrollment.module#EnrollmentModule',
    data: {edit: true}
  },
  {path: ':link', loadChildren: './components/termin/appointment.module#AppointmentModule'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
