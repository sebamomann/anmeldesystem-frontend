import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GoBackHeaderComponent} from './go-back-header.component';

describe('GoBackHeaderComponent', () => {
  let component: GoBackHeaderComponent;
  let fixture: ComponentFixture<GoBackHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GoBackHeaderComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoBackHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
