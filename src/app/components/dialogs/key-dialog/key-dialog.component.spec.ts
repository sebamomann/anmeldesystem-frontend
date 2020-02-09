import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {KeyDialogComponent} from './key-dialog.component';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

describe('KeyDialogComponent', () => {
  let component: KeyDialogComponent;
  let fixture: ComponentFixture<KeyDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, FormsModule,
        ReactiveFormsModule
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
