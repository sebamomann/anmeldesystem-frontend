import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LoginComponent} from './login.component';
import {MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule} from '@angular/material';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {WINDOW_PROVIDERS} from '../../../provider/window.provider';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, MatFormFieldModule,
        RouterTestingModule, MatIconModule,
        ReactiveFormsModule, FormsModule,
        MatInputModule, BrowserAnimationsModule,
        HttpClientTestingModule],
      declarations: [LoginComponent],
      providers: [WINDOW_PROVIDERS]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
