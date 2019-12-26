import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './components/app.component';
import {LandingPageComponent} from './components/landing-page/landing-page.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatNativeDateModule,
  MatRadioModule,
  MatSelectModule,
  MatSnackBarModule,
  MatStepperModule,
  MatTooltipModule
} from '@angular/material';
import {AppointmentComponent} from './components/termin/appointment.component';
import {AppointmentDataComponent} from './components/termin/appointment-data/appointment-data.component';
import {WINDOW_PROVIDERS} from './provider/window.provider';
import {LoginComponent} from './components/account/login/login.component';
import {RegisterComponent} from './components/account/register/register.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FilterDialogComponent} from './components/dialogs/filter/filterDialog.component';
import {CommentDialogComponent} from './components/dialogs/comment/commentDialog.component';
import {EnrollmentComponent} from './components/termin/enrollment/enrollment.component';
import {AppointmentCreateComponent} from './components/termin/appointment-create/appointment-create.component';
import {UrlEncodePipe} from './pipes/url-encode.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    AppointmentComponent,
    AppointmentDataComponent,
    LoginComponent,
    RegisterComponent,
    FilterDialogComponent,
    CommentDialogComponent,
    EnrollmentComponent,
    AppointmentCreateComponent,
    UrlEncodePipe,
  ],
  imports: [
    MatDatepickerModule,
    MatNativeDateModule,
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
    MatTooltipModule,
    MatChipsModule,
    MatSelectModule,
    MatStepperModule,
    MatDatepickerModule,
    MatAutocompleteModule,
  ],
  providers: [WINDOW_PROVIDERS, MatDatepickerModule],
  bootstrap: [AppComponent],
  exports: [FilterDialogComponent, CommentDialogComponent, UrlEncodePipe],
  entryComponents: [FilterDialogComponent, CommentDialogComponent],
})
export class AppModule {

}
