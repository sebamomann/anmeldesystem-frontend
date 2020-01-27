import {Injectable} from '@angular/core';
import {SwUpdate} from '@angular/service-worker';
import {interval} from 'rxjs';

@Injectable()
export class PwaService {
  public promptEvent;

  constructor(private swUpdate: SwUpdate) {
    if (swUpdate.isEnabled) {
      interval(6 * 60 * 60).subscribe(() => swUpdate.checkForUpdate()
        .then(() => console.log('checking for updates')));
    }

    window.addEventListener('beforeinstallprompt', event => {
      this.promptEvent = event;
    });

    // swUpdate.available.subscribe(event => {
    //   if (askUserToUpdate()) {
    //     window.location.reload();
    //   }
    // });
  }

  public checkForUpdates(): void {
    this.swUpdate.available.subscribe(event => this.promptUser());
  }

  private promptUser(): void {
    console.log('updating to new version');
    this.swUpdate.activateUpdate().then(() => document.location.reload());
  }
}
