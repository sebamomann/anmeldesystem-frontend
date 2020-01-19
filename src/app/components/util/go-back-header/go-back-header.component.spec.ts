import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GoBackHeaderComponent} from './go-back-header.component';
import {MatIconModule} from '@angular/material';
import {Location} from '@angular/common';

describe('GoBackHeaderComponent', () => {
  let component: GoBackHeaderComponent;
  let fixture: ComponentFixture<GoBackHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule],
      declarations: [GoBackHeaderComponent],
      providers: [Location]
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
