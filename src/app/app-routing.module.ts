import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LandingPageComponent} from './components/landing-page/landing-page.component';
import {AppointmentComponent} from './components/termin/appointment.component';


const routes: Routes = [
  {path: '', pathMatch: 'full', component: LandingPageComponent},
  {
    path: 'account', children: [
      {path: 'login', component: LandingPageComponent}
    ]
  },
  {
    path: 'enroll', children: [
      {path: '', pathMatch: 'full', component: AppointmentComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
