import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LandingPageComponent} from './components/landing-page/landing-page.component';
import {AppointmentComponent} from './components/termin/appointment.component';
import {LoginComponent} from './components/account/login/login.component';
import {RegisterComponent} from './components/account/register/register.component';
import {EnrollmentComponent} from './components/termin/enrollment/enrollment.component';


const routes: Routes = [
  {path: '', pathMatch: 'full', component: LandingPageComponent},
  {
    path: 'account', children: [
      {path: 'login', component: LoginComponent},
      {path: 'register', component: RegisterComponent}
    ]
  },
  {
    path: 'enroll', children: [
      {path: '', pathMatch: 'full', component: AppointmentComponent},
      {path: 'add', pathMatch: 'full', component: EnrollmentComponent},
      {path: 'change', pathMatch: 'full', component: EnrollmentComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
