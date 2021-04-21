import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EnrollmentMissingPermissionDialogComponent} from './enrollment-missing-permission.dialog.component';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule} from '@angular/material';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MatDialogRef} from '@angular/material/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('KeyDialogComponent', () => {
  let component: EnrollmentMissingPermissionDialogComponent;
  let fixture: ComponentFixture<EnrollmentMissingPermissionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, FormsModule,
        ReactiveFormsModule, MatInputModule,
        MatOptionModule, MatFormFieldModule,
        MatSelectModule, HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      declarations: [EnrollmentMissingPermissionDialogComponent],
      providers: [{
        provide: MatDialogRef, useValue: {}
      }, {
        provide: MAT_DIALOG_DATA,
        useValue: {
          enrollment: {id: ''}, operation: ''
        }
      }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentMissingPermissionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
