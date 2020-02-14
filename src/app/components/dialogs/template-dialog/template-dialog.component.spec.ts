import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TemplateDialogComponent} from './template-dialog.component';
import {MatDialogModule, MatIconModule, MatListModule} from '@angular/material';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {Globals} from '../../../globals';

describe('TemplateDialogComponent', () => {
  let component: TemplateDialogComponent;
  let fixture: ComponentFixture<TemplateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatListModule, MatIconModule,
        MatDialogModule, HttpClientTestingModule,
        RouterTestingModule],
      declarations: [TemplateDialogComponent],
      providers: [Globals]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
