import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PasswordresetComponent} from './passwordreset.component';
import {MatCardModule, MatFormFieldModule, MatIconModule, MatProgressSpinnerModule} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('PasswordresetComponent', () => {
  let component: PasswordresetComponent;
  let fixture: ComponentFixture<PasswordresetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, ReactiveFormsModule,
        MatIconModule, MatFormFieldModule,
        MatProgressSpinnerModule, RouterTestingModule,
        HttpClientTestingModule],
      declarations: [PasswordresetComponent]
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
