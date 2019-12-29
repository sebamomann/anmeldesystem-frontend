import {Component, OnInit} from '@angular/core';
import {TerminService} from '../../../services/termin.service';
import {IAppointmentModel} from '../../../models/IAppointment.model';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public appointments$: Observable<IAppointmentModel[]> = this.terminService.getTermine();

  constructor(public terminService: TerminService, private router: Router) {

  }

  ngOnInit() {
  }

}
