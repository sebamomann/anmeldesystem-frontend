import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FilterDialogComponent} from './filterDialog.component';
import {MatCheckboxModule, MatFormFieldModule, MatIconModule, MatRadioModule, MatTooltipModule} from '@angular/material';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

describe('FilterDialogComponent', () => {
  let component: FilterDialogComponent;
  let fixture: ComponentFixture<FilterDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatFormFieldModule, MatCheckboxModule,
        ReactiveFormsModule, FormsModule,
        MatRadioModule, MatIconModule,
        MatTooltipModule, MatDialogModule],
      declarations: [FilterDialogComponent],
      providers: [
        {
          provide: MatDialogRef, useValue: {}
        }, {
          provide: MAT_DIALOG_DATA,
          useValue: {
            filter: {
              additions: [], driverPassenger: '', explicitly: ''
            },
            appointment: {
              driverAddition: true
            },
            error: true
          }
        }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
