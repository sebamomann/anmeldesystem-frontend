import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {PasswordresetComponent} from './passwordreset/passwordreset.component';
import {RouterModule, Routes} from '@angular/router';
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatTooltipModule
} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';
import {ValidatorService} from '../../_helper/validatorService';


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'verify/:mail/:token', component: RegisterComponent},
  {path: 'passwordreset/:mail/:token', component: PasswordresetComponent},
  {path: 'passwordreset', component: PasswordresetComponent}
];


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    PasswordresetComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  providers: [
    ValidatorService
  ]
})
export class AccountModule {
}
