import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ReleasenotesComponent} from './releasenotes.component';
import {MatCardModule, MatExpansionModule, MatTableModule} from '@angular/material';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('ReleasenotesComponent', () => {
  let component: ReleasenotesComponent;
  let fixture: ComponentFixture<ReleasenotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, MatExpansionModule,
        MatTableModule, HttpClientTestingModule],
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
