import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-fetch-appointment',
  templateUrl: './fetch-appointment.component.html',
  styleUrls: ['./fetch-appointment.component.scss']
})
export class FetchAppointmentComponent implements OnInit {
  @Input()
  public done: boolean;
  @Input()
  public percentDone: number;

  constructor() {
  }

  ngOnInit() {
  }
}
