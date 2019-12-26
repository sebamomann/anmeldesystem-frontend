import {Component, OnInit} from '@angular/core';
import {TerminService} from '../../../services/termin.service';
import {IAppointmentModel} from '../../../models/IAppointment.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public appointment: IAppointmentModel[] = this.terminService.getTermine();

  constructor(public terminService: TerminService) {

  }

  ngOnInit() {
  }

}
