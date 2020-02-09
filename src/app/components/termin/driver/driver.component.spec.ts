import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DriverComponent} from './driver.component';
import {MatCardModule, MatIconModule, MatProgressBarModule} from '@angular/material';
import {APP_BASE_HREF, Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {RouterTestingModule} from '@angular/router/testing';
import {RouterModule} from '@angular/router';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {GoBackHeaderComponent} from '../../util/go-back-header/go-back-header.component';

describe('DriverComponent', () => {
  let component: DriverComponent;
  let fixture: ComponentFixture<DriverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule, MatCardModule,
        MatProgressBarModule, HttpClientTestingModule,
        RouterTestingModule],
      declarations: [DriverComponent, GoBackHeaderComponent],
      providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}, RouterTestingModule, RouterModule,
        {provide: APP_BASE_HREF, useValue: '/'}]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
