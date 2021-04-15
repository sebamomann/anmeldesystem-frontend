import {LOCALE_ID, NgModule} from '@angular/core';
import {AppComponent} from './components/app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatDialogModule, MatProgressSpinnerModule, MatSnackBarModule} from '@angular/material';
import {WINDOW_PROVIDERS} from './provider/window.provider';
import {DatePipe, LocationStrategy, PathLocationStrategy, registerLocaleData} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ServiceWorkerModule} from '@angular/service-worker';
import {PwaDialogComponent} from './components/dialogs/pwa-dialog/pwa-dialog.component';
import {Globals} from './globals';
import localeDe from '@angular/common/locales/de';
import {AppRoutingModule} from './app-routing.module';
import {MonthnamePipe} from './pipes/monthname.pipe';
import {LoadingModule} from './components/html-template/loading/loading.module';
import {UpdateService} from './services/update.service';
import {AuthConfigModule} from './auth-config/auth-config.module';
import {AuthInterceptor} from './interceptor/authentication.interceptor';

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
    AuthConfigModule
  ],
  providers: [
    WINDOW_PROVIDERS,
    {
      multi: true,
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
    },
    MonthnamePipe,
    Globals,
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    },
    {
      provide: LOCALE_ID,
      useValue: 'de-DE'
    },
    UpdateService
  ],
  bootstrap: [
    AppComponent
  ],
  exports: [
    DatePipe,
    PwaDialogComponent,
  ],
  entryComponents: [
    PwaDialogComponent
  ],
})
export class AppModule {
  constructor() {
  }
}
