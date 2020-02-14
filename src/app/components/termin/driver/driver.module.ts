import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {DriverComponent} from './driver.component';
import {MatButtonModule, MatCardModule, MatIconModule, MatProgressBarModule} from '@angular/material';

const routes: Routes = [
  {path: '', component: DriverComponent}
];


@NgModule({
  declarations: [
    DriverComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatButtonModule,
  ]
})
export class DriverModule {
}
