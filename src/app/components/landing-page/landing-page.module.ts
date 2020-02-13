import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {LandingPageComponent} from './landing-page.component';
import {MatButtonModule, MatCardModule} from '@angular/material';

const routes: Routes = [
  {path: '', component: LandingPageComponent},
];


@NgModule({
  declarations: [
    LandingPageComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatButtonModule,
  ]
})
export class LandingPageModule {
}
