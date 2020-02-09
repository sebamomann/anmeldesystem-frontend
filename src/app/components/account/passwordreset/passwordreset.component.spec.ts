import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PasswordresetComponent} from './passwordreset.component';
import {MatCardModule} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';

describe('PasswordresetComponent', () => {
  let component: PasswordresetComponent;
  let fixture: ComponentFixture<PasswordresetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, ReactiveFormsModule],
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
