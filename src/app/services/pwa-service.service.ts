import {Injectable} from '@angular/core';
import {SwUpdate} from '@angular/service-worker';
import {interval} from 'rxjs';

@Injectable()
export class PwaService {
  public promptEvent;

  constructor(private swUpdate: SwUpdate) {
    if (swUpdate.isEnabled) {
      interval(6 * 60 * 60).subscribe(() => swUpdate.checkForUpdate()
        .then(() => console.log('checking for pwa updates')));
    }
  }

  public checkForUpdates(): void {
    this.swUpdate.available.subscribe(event => this.promptUser());
  }

  private promptUser(): void {
    console.log('updating to new version');
    this.swUpdate.activateUpdate().then(() => document.location.reload());
  }
}
