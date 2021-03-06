import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ConfirmationDialogComponent} from './confirmation-dialog.component';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material';
import {MatDialogRef} from '@angular/material/dialog';

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      declarations: [ConfirmationDialogComponent],
      providers: [{
        provide: MAT_DIALOG_DATA,
        useValue: {message: ''}
      }, {
        provide: MatDialogRef,
        useValue: {}
      }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
