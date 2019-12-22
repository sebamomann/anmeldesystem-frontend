import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './components/app.component';
import {LandingPageComponent} from './components/landing-page/landing-page.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatBadgeModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule, MatRadioModule,
  MatSnackBarModule
} from '@angular/material';
import {AppointmentComponent} from './components/termin/appointment.component';
import {AppointmentDataComponent} from './components/termin/appointment-data/appointment-data.component';
import {WINDOW_PROVIDERS} from './provider/window.provider';
import {LoginComponent} from './components/account/login/login.component';
import {RegisterComponent} from './components/account/register/register.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FilterDialogComponent} from './components/dialogs/filter/filterDialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    AppointmentComponent,
    AppointmentDataComponent,
    LoginComponent,
    RegisterComponent,
    FilterDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatExpansionModule,
    MatBadgeModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatCardModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatDialogModule,
    MatRadioModule,
    FormsModule,
  ],
  providers: [WINDOW_PROVIDERS],
  bootstrap: [AppComponent],
  exports: [FilterDialogComponent],
  entryComponents: [FilterDialogComponent]
})
export class AppModule {

}
