import {Inject, Injectable} from '@angular/core';
import {WINDOW} from '../provider/window.provider';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  constructor(@Inject(WINDOW) private window: Window) {
  }

  getHostname(): string {
    return `${this.window.location.hostname}/`;
  }
}
