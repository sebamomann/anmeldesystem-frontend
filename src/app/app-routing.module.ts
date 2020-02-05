import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LandingPageComponent} from './components/landing-page/landing-page.component';
import {AppointmentComponent} from './components/termin/appointment.component';
import {LoginComponent} from './components/account/login/login.component';
import {RegisterComponent} from './components/account/register/register.component';
import {EnrollmentComponent} from './components/termin/enrollment/enrollment.component';
import {AppointmentCreateComponent} from './components/termin/appointment-create/appointment-create.component';
import {DashboardComponent} from './components/termin/dashboard/dashboard.component';
import {DriverComponent} from './components/termin/driver/driver.component';
import {AuthGuard} from './_helper/auth.guard';
import {PasswordresetComponent} from './components/account/passwordreset/passwordreset.component';


const routes: Routes = [
  {path: '', pathMatch: 'full', component: LandingPageComponent},
  {
    path: 'account', children: [
      {path: 'login', component: LoginComponent},
      {path: 'register', component: RegisterComponent},
      {path: 'verify/:mail/:token', component: RegisterComponent},
      {path: 'passwordreset/:mail/:token', component: PasswordresetComponent},
      {path: 'passwordreset', component: PasswordresetComponent}
    ]
  },
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'create', component: AppointmentCreateComponent, canActivate: [AuthGuard]},
  {
    path: 'appointment', children: [
      {path: 'driver', pathMatch: 'full', component: DriverComponent},
    ]
  },
  {
    path: 'enroll', children: [
      {path: '', pathMatch: 'full', component: AppointmentComponent},
      {path: 'add', pathMatch: 'full', component: EnrollmentComponent},
    ]
  },
  {path: 'enrollment', pathMatch: 'full', component: EnrollmentComponent, data: {edit: true}},
  {path: ':link', component: AppointmentComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
