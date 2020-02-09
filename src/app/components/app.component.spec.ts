import {async, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from './app.component';
import {WINDOW_PROVIDERS} from '../provider/window.provider';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {PwaService} from '../services/pwa-service.service';
import {ServiceWorkerModule, SwUpdate} from '@angular/service-worker';
import {environment} from '../../environments/environment';
import {MatDialogModule} from '@angular/material';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, HttpClientTestingModule,
        ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
        MatDialogModule
      ],
      declarations: [
        AppComponent,
      ],
      providers: [WINDOW_PROVIDERS, PwaService, SwUpdate, particlesJS]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'anmeldesystem'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('anmeldesystem');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('anmeldesystem app is running!');
  });
});
