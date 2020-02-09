import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {KeyDialogComponent} from './key-dialog.component';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule} from '@angular/material';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('KeyDialogComponent', () => {
  let component: KeyDialogComponent;
  let fixture: ComponentFixture<KeyDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, FormsModule,
        ReactiveFormsModule, MatInputModule,
        MatOptionModule, MatFormFieldModule,
        MatSelectModule, HttpClientTestingModule
      ],
      declarations: [KeyDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
