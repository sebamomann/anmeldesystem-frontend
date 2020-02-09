import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PwaDialogComponent} from './pwa-dialog.component';
import {MatDialogModule} from '@angular/material';

describe('PwaDialogComponent', () => {
  let component: PwaDialogComponent;
  let fixture: ComponentFixture<PwaDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      declarations: [PwaDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PwaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
