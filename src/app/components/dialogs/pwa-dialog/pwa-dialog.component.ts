import {Component} from '@angular/core';
import {MatDialogRef, MatSnackBar} from '@angular/material';
import {PwaService} from '../../../services/pwa-service.service';

@Component({
  selector: 'app-pwa-dialog',
  templateUrl: './pwa-dialog.component.html',
  styleUrls: ['./pwa-dialog.component.scss']
})
export class PwaDialogComponent {
  public opened = false;

  constructor(
    public dialogRef: MatDialogRef<PwaDialogComponent>, public pwa: PwaService,
    public snackBar: MatSnackBar) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  installPwa(): void {
    const prompt = this.pwa.getDeferredPrompt();
    prompt.prompt();
    prompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        this.snackBar.open('*clicks* noice', null, {
          duration: 2000,
          panelClass: 'snackbar-default'
        });
      } else {
        this.snackBar.open('hm ._. schade', null, {
          duration: 2000,
          panelClass: 'snackbar-default'
        });
      }
      this.opened = true;
      this.dialogRef.close();
    });
  }
}
