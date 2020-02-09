import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DashboardComponent} from './dashboard.component';
import {MatCardModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatSnackBarModule} from '@angular/material';
import {APP_BASE_HREF, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {AppointmentDataComponent} from '../appointment-data/appointment-data.component';
import {RouterTestingModule} from '@angular/router/testing';
import {WINDOW_PROVIDERS} from '../../../provider/window.provider';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Globals} from '../../../globals';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatIconModule, MatCardModule,
        MatFormFieldModule, RouterTestingModule,
        MatSnackBarModule, HttpClientTestingModule,
        MatProgressBarModule, BrowserAnimationsModule
      ],
      providers: [WINDOW_PROVIDERS, {provide: LocationStrategy, useClass: PathLocationStrategy}, Globals,
        {provide: APP_BASE_HREF, useValue: '/'}],
      declarations: [DashboardComponent, AppointmentDataComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
