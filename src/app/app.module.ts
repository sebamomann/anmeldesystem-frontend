import {LOCALE_ID, NgModule} from '@angular/core';
import {AppComponent} from './components/app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatDialogModule, MatProgressSpinnerModule, MatSnackBar, MatSnackBarModule} from '@angular/material';
import {WINDOW_PROVIDERS} from './provider/window.provider';
import {DatePipe, LocationStrategy, PathLocationStrategy, registerLocaleData} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ServiceWorkerModule, SwUpdate} from '@angular/service-worker';
import {PwaDialogComponent} from './components/dialogs/pwa-dialog/pwa-dialog.component';
import {Globals} from './globals';
import localeDe from '@angular/common/locales/de';
import {AppRoutingModule} from './app-routing.module';
import {MonthnamePipe} from './pipes/monthname.pipe';
import {AuthenticationService} from './services/authentication.service';
import {AuthInterceptor} from './_helper/interceptor/refreshToken.interceptor';
import {LoadingModule} from './components/html-template/loading/loading.module';
import {switchMap} from 'rxjs/operators';

registerLocaleData(localeDe);

@NgModule({
  declarations: [
    AppComponent,
    PwaDialogComponent,
  ],
  imports: [
    MatSnackBarModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: true, registrationStrategy: 'registerImmediately'}),
    MatProgressSpinnerModule,
    MatDialogModule,
    MatButtonModule,
    LoadingModule,
  ],
  providers: [WINDOW_PROVIDERS,
    AuthenticationService,
    MonthnamePipe, Globals,
    {provide: LocationStrategy, useClass: PathLocationStrategy},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {provide: LOCALE_ID, useValue: 'de-DE'}],
  bootstrap: [AppComponent],
  exports: [
    DatePipe,
    PwaDialogComponent,
  ],
  entryComponents: [
    PwaDialogComponent
  ],
})
export class AppModule {
  constructor(swUpdate: SwUpdate, snackbar: MatSnackBar) {
    swUpdate.available.pipe(
      switchMap(() => snackbar.open('Neue Version verfügbar', 'Neu laden').onAction())
    ).subscribe(() => window.location.reload());
  }
}
