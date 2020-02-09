import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RegisterComponent} from './register.component';
import {MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule} from '@angular/material';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {WINDOW_PROVIDERS} from '../../../provider/window.provider';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, MatFormFieldModule,
        MatIconModule, RouterTestingModule,
        ReactiveFormsModule, FormsModule,
        MatIconModule, MatInputModule,
        BrowserAnimationsModule, HttpClientTestingModule],
      declarations: [RegisterComponent],
      providers: [WINDOW_PROVIDERS]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
