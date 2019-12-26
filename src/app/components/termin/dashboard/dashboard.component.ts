import { Component, OnInit } from '@angular/core';
import {TerminService} from '../../../services/termin.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public appointments: IAppointment;

  constructor(public terminService: TerminService) {
    this.terminService
  }

  ngOnInit() {
  }

}
