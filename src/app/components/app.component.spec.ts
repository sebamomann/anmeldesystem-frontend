import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from './app.component';
import {WINDOW_PROVIDERS} from '../provider/window.provider';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {PwaService} from '../services/pwa-service.service';
import {ServiceWorkerModule, SwUpdate} from '@angular/service-worker';
import {environment} from '../../environments/environment';
import {MatDialogModule} from '@angular/material';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, HttpClientTestingModule,
        ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
        MatDialogModule,
        NoopAnimationsModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [WINDOW_PROVIDERS,
        {provide: PwaService, useClass: PwaService},
        SwUpdate,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  // it(`should have as title 'Anmeldesystem'`, () => {
  //   fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app.title).toEqual('Anmeldesystem');
  // });
  //
  // it('should render title', () => {
  //   fixture = TestBed.createComponent(AppComponent);
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('.content span').textContent).toContain('Anmeldesystem app is running!');
  // });
});
