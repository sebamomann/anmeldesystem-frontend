import { HexagonLoaderModule } from './../../html-template/hexagon-loader/hexagon-loader.module';
import { MatCardModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LogoutComponent } from './logout.component';

const routes: Routes = [
  { path: '', component: LogoutComponent },
];

@NgModule({
  declarations: [
    LogoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    HexagonLoaderModule
  ]
})
export class LogoutModule {
}
