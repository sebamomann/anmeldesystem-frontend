import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PasswordresetComponent} from './passwordreset.component';
import {MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressSpinnerModule} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {WINDOW_PROVIDERS} from '../../../provider/window.provider';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('PasswordresetComponent', () => {
  let component: PasswordresetComponent;
  let fixture: ComponentFixture<PasswordresetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, ReactiveFormsModule,
        MatIconModule, MatFormFieldModule,
        MatProgressSpinnerModule, RouterTestingModule,
        HttpClientTestingModule, MatInputModule,
        BrowserAnimationsModule],
      declarations: [PasswordresetComponent],
      providers: [WINDOW_PROVIDERS]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordresetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
