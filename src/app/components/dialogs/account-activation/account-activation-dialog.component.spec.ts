import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AccountActivationDialogComponent} from './account-activation-dialog.component';

describe('AccountActivationComponent', () => {
  let component: AccountActivationDialogComponent;
  let fixture: ComponentFixture<AccountActivationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountActivationDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountActivationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
