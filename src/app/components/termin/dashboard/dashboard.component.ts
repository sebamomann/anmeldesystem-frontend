import {Component, OnInit} from '@angular/core';
import {TerminService} from '../../../services/termin.service';
import {IAppointmentModel} from '../../../models/IAppointment.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public appointments: IAppointmentModel[] = this.terminService.getTermine();

  constructor(public terminService: TerminService, private router: Router) {

  }

  ngOnInit() {
  }
}
