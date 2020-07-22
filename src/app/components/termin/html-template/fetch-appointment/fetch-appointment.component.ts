import {Component, Input, OnInit} from '@angular/core';
import {IEnrollmentModel} from '../../../../models/IEnrollment.model';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-fetch-appointment',
  templateUrl: './fetch-appointment.component.html',
  styleUrls: ['./fetch-appointment.component.scss']
})
export class FetchAppointmentComponent implements OnInit {
  public done$ = new BehaviorSubject(undefined);
  public _done = false;

  @Input()
  public percentDone: number;

  @Input('done') set enrollments(enrollments: IEnrollmentModel[]) {
    this.done$.next(enrollments);
  };

  constructor() {
  }

  ngOnInit() {
    setTimeout(() => {
      this.done$.subscribe((val) => {
        this._done = val;
      });
    });
  }
}
