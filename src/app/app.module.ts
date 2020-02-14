import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './components/app.component';
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
  MatListModule,
  MatNativeDateModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSnackBarModule,
  MatStepperModule,
  MatTabsModule,
  MatTooltipModule
} from '@angular/material';
import {WINDOW_PROVIDERS} from './provider/window.provider';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FilterDialogComponent} from './components/dialogs/filter/filterDialog.component';
import {CommentDialogComponent} from './components/dialogs/comment/commentDialog.component';
import {DatePipe, LocationStrategy, PathLocationStrategy, registerLocaleData} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {TemplateDialogComponent} from './components/dialogs/template-dialog/template-dialog.component';
import {AuthInterceptor} from './_helper/interceptor/auth.interceptor';
import {JwtInterceptor} from './_helper/interceptor/jwt.interceptor';
import {ConfirmationDialogComponent} from './components/dialogs/confirmation-dialog/confirmation-dialog.component';
import {GoBackHeaderComponent} from './components/util/go-back-header/go-back-header.component';
import {KeyDialogComponent} from './components/dialogs/key-dialog/key-dialog.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {PwaService} from './services/pwa-service.service';
import {PwaDialogComponent} from './components/dialogs/pwa-dialog/pwa-dialog.component';
import {Globals} from './globals';
import localeDe from '@angular/common/locales/de';
import {NgxMatDatetimePickerModule} from 'ngx-mat-datetime-picker';
import {DashboardModule} from './components/termin/dashboard/dashboard.module';

const HttpStatus = require('http-status-codes');

registerLocaleData(localeDe);

@NgModule({
  declarations: [
    AppComponent,
    FilterDialogComponent,
    CommentDialogComponent,
    TemplateDialogComponent,
    ConfirmationDialogComponent,
    GoBackHeaderComponent,
    KeyDialogComponent,
    PwaDialogComponent,
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
    MatTabsModule,
    MatProgressBarModule,
    HttpClientModule,
    MatListModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    MatProgressSpinnerModule,
    NgxMatDatetimePickerModule,
    DashboardModule,
  ],
  providers: [WINDOW_PROVIDERS, PwaService, Globals,
    {provide: LocationStrategy, useClass: PathLocationStrategy},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent],
  exports: [FilterDialogComponent,
    CommentDialogComponent,
    DatePipe,
    PwaDialogComponent
  ],
  entryComponents: [
    FilterDialogComponent,
    CommentDialogComponent,
    TemplateDialogComponent,
    ConfirmationDialogComponent,
    KeyDialogComponent,
    PwaDialogComponent
  ],
})
export class AppModule {

}
