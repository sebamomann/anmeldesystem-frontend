import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PwaDialogComponent} from './pwa-dialog.component';
import {MatDialogModule} from '@angular/material';
import {MatDialogRef} from '@angular/material/dialog';
import {PwaService} from '../../../services/pwa-service.service';
import {ServiceWorkerModule, SwUpdate} from '@angular/service-worker';
import {environment} from '../../../../environments/environment';

describe('PwaDialogComponent', () => {
  let component: PwaDialogComponent;
  let fixture: ComponentFixture<PwaDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule,
        ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production})],
      declarations: [PwaDialogComponent],
      providers: [{provide: MatDialogRef, useValue: {}}, PwaService,
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
