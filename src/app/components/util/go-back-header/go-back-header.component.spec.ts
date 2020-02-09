import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GoBackHeaderComponent} from './go-back-header.component';
import {MatIconModule} from '@angular/material';
import {APP_BASE_HREF, Location, LocationStrategy, PathLocationStrategy} from '@angular/common';

describe('GoBackHeaderComponent', () => {
  let component: GoBackHeaderComponent;
  let fixture: ComponentFixture<GoBackHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule],
      declarations: [GoBackHeaderComponent],
      providers: [Location, {
        provide: LocationStrategy, useClass: PathLocationStrategy
      },
        {
          provide: APP_BASE_HREF, useValue: '/'
        }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoBackHeaderComponent);
    component = fixture.componentInstance;
    component.appointment = {
      title: '',
      description: '',
      location: '',
      creator: {},
      date: '',
      deadline: '',
      link: '',
      maxEnrollments: 0,
      additions: [],
      driverAddition: false,
      enrollments: [],
      files: [],
      administrators: []
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
