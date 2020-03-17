import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PasswordresetComponent} from './main/passwordreset/passwordreset.component';
import {RouterModule, Routes} from '@angular/router';
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatTooltipModule
} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';
import {ValidatorService} from '../../_helper/validatorService';
import {UserDataModule} from './form/user-data/user-data.module';
import {AccountComponent} from './account.component';
import {AccountProfileComponent} from './account-profile/account-profile.component';
import {SavedModule} from '../html-template/saved/saved.module';
import {LoginComponent} from './main/login/login.component';
import {RegisterComponent} from './main/register/register.component';
import {EmailChangeComponent} from './account-profile/email-change/email-change.component';
import {EmailChangeModule} from './account-profile/email-change/email-change.module';
import {LogoutComponent} from './main/logout/logout.component';
import {AuthGuard} from '../../_helper/auth.guard';
import {LoadingModule} from '../html-template/loading/loading.module';


const routes: Routes = [
  {path: '', component: AccountComponent},
  {path: 'profile', component: AccountProfileComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'logout', component: LogoutComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'verify/:mail/:token', component: RegisterComponent},
  {path: 'mail/verify/:mail/:token', component: EmailChangeComponent},
  {path: 'passwordreset', component: PasswordresetComponent},
  {path: 'passwordreset/:mail/:token', component: PasswordresetComponent},
];


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    PasswordresetComponent,
    AccountComponent,
    AccountProfileComponent,
    LogoutComponent,
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
    UserDataModule,
    SavedModule,
    EmailChangeModule,
    MatListModule,
    LoadingModule
  ],
  providers: [
    ValidatorService
  ]
})
export class AccountModule {
}
