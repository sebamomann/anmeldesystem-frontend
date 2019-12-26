import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CommentDialogComponent} from './commentDialog.component';
import {
  MatCardModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatTooltipModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('CommentDialogComponent', () => {
  let component: CommentDialogComponent;
  let fixture: ComponentFixture<CommentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, MatExpansionModule,
        MatIconModule, MatExpansionModule,
        FormsModule, MatFormFieldModule,
        MatTooltipModule, ReactiveFormsModule,
        MatDialogModule, BrowserAnimationsModule,
        MatInputModule],
      declarations: [CommentDialogComponent],
      providers: [{provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: {enrollment: {comments: []}}}]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
