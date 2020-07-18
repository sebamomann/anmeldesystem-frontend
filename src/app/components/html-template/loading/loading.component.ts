import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  @Input()
  private customMessage = '';

  public message: string;
  private messages = [
    'Lade Wetter',
    'Kaue Kaugummi',
    'Hole Daten',
    'Huiiii',
    'Kommt noch was?',
    'Übermittle Daten an die NSA',
    'Seba sagt Hi',
    'Warte kurz ...'];

  constructor() {
  }

  async ngOnInit() {
    this.message = this.customMessage;

    if (this.customMessage === '') {
      while (true) {
        const rand = Math.random() * this.messages.length;
        this.message = this.messages[Math.ceil(rand) - 1];
        await this.delay(400 + (Math.random() * 1500));
      }
    }
  }


  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
