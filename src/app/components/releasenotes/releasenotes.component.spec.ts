import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ReleasenotesComponent} from './releasenotes.component';
import {MatCardModule, MatExpansionModule, MatTabsModule} from '@angular/material';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('ReleasenotesComponent', () => {
  let component: ReleasenotesComponent;
  let fixture: ComponentFixture<ReleasenotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, MatExpansionModule,
        HttpClientTestingModule, MatTabsModule,
        BrowserAnimationsModule],
      declarations: [ReleasenotesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleasenotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
