import {Component, OnInit} from '@angular/core';
import {IAppointmentModel} from '../../../models/IAppointment.model';
import {TerminService} from '../../../services/termin.service';
import {Location} from '@angular/common';
import {IEnrollmentModel} from '../../../models/IEnrollment.model';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss']
})
export class DriverComponent implements OnInit {

  public appointment$: Observable<IAppointmentModel>;
  public data: MyType = {};
  public drivers: IEnrollmentModel[];
  public link;

  constructor(private terminService: TerminService, private location: Location, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.link = params.link;
    });
  }

  async ngOnInit() {
    this.appointment$ = await this.terminService.getTermin('');

    this.appointment$.subscribe(app => {
      this.drivers = app.enrollments.filter(fAppointment => fAppointment.driver !== null);

      this.data.neededTo = app.enrollments.filter(fAppointment => {
        if (fAppointment.passenger != null
          && (fAppointment.passenger.requirement === 1 || fAppointment.passenger.requirement === 2)) {
          return fAppointment;
        }
      }).length;
      this.data.gotTo = 0;
      // tslint:disable-next-line:no-unused-expression
      app.enrollments.filter(fAppointment => {
        if (fAppointment.driver != null
          && (fAppointment.driver.service === 1 || fAppointment.driver.service === 2)) {
          this.data.gotTo += fAppointment.driver.seats;
        }
      }).length;
      this.data.neededFrom = app.enrollments.filter(fAppointment => {
        if (fAppointment.passenger != null
          && (fAppointment.passenger.requirement === 1 || fAppointment.passenger.requirement === 3)) {
          return fAppointment;
        }
      }).length;
      this.data.gotFrom = 0;
      // tslint:disable-next-line:no-unused-expression
      app.enrollments.filter(fAppointment => {
        if (fAppointment.driver != null
          && (fAppointment.driver.service === 1 || fAppointment.driver.service === 3)) {
          this.data.gotFrom += fAppointment.driver.seats;
        }
      }).length;
    });
  }

  goBack() {
    this.location.back();
  }

  compare(nr1: number, nr2: number) {
    if (nr1 > nr2) {
      return 1;
    }

    if (nr1 === nr2) {
      return 0;
    }

    if (nr1 < nr2) {
      return -1;
    }
  }
}

interface MyType {
  [key: string]: number;
}
