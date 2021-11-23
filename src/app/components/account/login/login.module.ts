import { HexagonLoaderModule } from './../../html-template/hexagon-loader/hexagon-loader.module';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { MatCardModule, MatIconModule } from '@angular/material';

const routes: Routes = [
  { path: '', component: LoginComponent },
];

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    HexagonLoaderModule,
    MatIconModule
  ]
})
export class LoginModule {
}
