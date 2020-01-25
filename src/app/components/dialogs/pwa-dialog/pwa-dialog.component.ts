import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {PwaService} from '../../../services/pwa-service.service';

@Component({
  selector: 'app-pwa-dialog',
  templateUrl: './pwa-dialog.component.html',
  styleUrls: ['./pwa-dialog.component.scss']
})
export class PwaDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PwaDialogComponent>, public Pwa: PwaService) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  installPwa(): void {
    this.Pwa.promptEvent.prompt();
  }

}
