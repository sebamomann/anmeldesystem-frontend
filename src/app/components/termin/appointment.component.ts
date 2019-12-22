import {Component, OnInit} from '@angular/core';
import {TerminService} from '../../services/termin.service';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit {

  constructor(private terminService: TerminService) {
  }

  private appointment = this.terminService.getTermin('');
  private enrollments = this.appointment.enrollments;
  allowModify = true;

  ngOnInit() {
  }

}
