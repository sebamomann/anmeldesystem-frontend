import {Component, OnInit} from '@angular/core';
import {LoadingService} from '../../../services/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  public message: string = undefined;
  public show = true;
  private customMessage = '';
  private messages = [
    'Sekunde ...',
    'Lade Daten',
    'Huiiii',
    'Kommt noch was?',
    'Übermittle Daten an die NSA',
    'Seba sagt Hi',
    'Gleich hab ichs'];
  private timer: any;
  private keep: any;
  private orig: string;

  constructor(private loadingService: LoadingService) {
  }

  async ngOnInit() {
    this.message = this.customMessage;

    this.loadingService.message$
      .subscribe(async (val) => {
        this.orig = val;
        this.start();
      });

    this.loadingService.messageSec$
      .subscribe(async (val) => {
        if (val) {
          this.keep = this.keep ? this.keep : this.message;
          this.show = true;
          this.message = val;
        } else {
          this.show = this.keep !== undefined && this.message === undefined;
          this.start();
          this.keep = undefined;
        }
      });
  }

  private start() {
    const val = this.orig;
    if (val === '') {
      this.show = true;
      this.randomMessageTimer();
    } else if (val === undefined) {
      this.show = false;
      clearTimeout(this.timer);
    } else if (!this.keep) {
      this.show = true;
      this.message = val;
      clearTimeout(this.timer);
    }
  }

  private randomMessageTimer() {
    this.setRandomMessage();
    this.timer = setTimeout(() => {
      this.randomMessageTimer();
    }, 1800);
  }

  private setRandomMessage() {
    const rand = Math.random() * this.messages.length;
    this.message = this.messages[Math.ceil(rand) - 1];
  }
}
