import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-fetch-appointment',
  templateUrl: './fetch-appointment.component.html',
  styleUrls: ['./fetch-appointment.component.scss']
})
export class FetchAppointmentComponent implements OnInit {
  public done$ = new BehaviorSubject(undefined);
  @Input()
  public percentDone: number;

  public _done = false;

  constructor() {
  }

  @Input('done') set done(done: boolean) {
    this.done$.next(done);
  };

  ngOnInit() {
    setTimeout(() => {
      this.done$.subscribe((val) => {
        this._done = val;
      });
    });
  }
}
