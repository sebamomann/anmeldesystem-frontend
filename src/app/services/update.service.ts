import {Injectable} from '@angular/core';

import {MatSnackBar} from '@angular/material';
import {SwUpdate} from '@angular/service-worker';

const version = require('package.json').version;

@Injectable()
export class UpdateService {
  constructor(private swUpdate: SwUpdate, private snackbar: MatSnackBar) {
    this.swUpdate.available.subscribe(evt => {
      const snack = this.snackbar.open('Neue Version verfügbar - ' + version, 'Neu laden');
      snack
        .onAction()
        .subscribe(() => {
          window.location.reload();
        });
    });
  }

  public checkForUpdate() {
    this.swUpdate.checkForUpdate().then();
  }
}
