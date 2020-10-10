import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PwaDialogComponent} from './pwa-dialog.component';
import {MatDialogModule} from '@angular/material';
import {MatDialogRef} from '@angular/material/dialog';
import {ServiceWorkerModule, SwUpdate} from '@angular/service-worker';

describe('PwaDialogComponent', () => {
  let component: PwaDialogComponent;
  let fixture: ComponentFixture<PwaDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule,
        ServiceWorkerModule.register('ngsw-worker.js', {enabled: true, registrationStrategy: 'registerImmediately'})],
      declarations: [PwaDialogComponent],
      providers: [{provide: MatDialogRef, useValue: {}},
        SwUpdate]
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
