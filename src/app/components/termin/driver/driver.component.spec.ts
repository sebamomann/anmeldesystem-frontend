import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DriverComponent} from './driver.component';
import {MatCardModule, MatIconModule, MatProgressBarModule} from '@angular/material';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {RouterTestingModule} from '@angular/router/testing';
import {RouterModule} from '@angular/router';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('DriverComponent', () => {
  let component: DriverComponent;
  let fixture: ComponentFixture<DriverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule, MatCardModule,
        MatProgressBarModule, HttpClientTestingModule,
        RouterTestingModule],
      declarations: [DriverComponent],
      providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}, RouterTestingModule, RouterModule]
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
