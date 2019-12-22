import {Component, Inject} from '@angular/core';
import {Router} from '@angular/router';
import {WINDOW} from '../provider/window.provider';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private now: string;

  constructor(private router: Router, @Inject(WINDOW) private window: Window) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const date = new Date();
    this.now = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

  }

  getHostname(): string {
    return this.window.location.hostname;
  }

}
