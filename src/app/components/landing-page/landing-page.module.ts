import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {LandingPageComponent} from './landing-page.component';
import {MatButtonModule, MatCardModule} from '@angular/material';
import {LoadingModule} from '../html-template/loading/loading.module';

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
    LoadingModule,
  ]
})
export class LandingPageModule {
}
