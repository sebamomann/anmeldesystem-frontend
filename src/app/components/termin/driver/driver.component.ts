import {Component, OnInit} from '@angular/core';
import {IAppointmentModel} from '../../../models/IAppointment.model';
import {AppointmentService} from '../../../services/appointment.service';
import {Location} from '@angular/common';
import {IEnrollmentModel} from '../../../models/IEnrollment.model';
import {ActivatedRoute} from '@angular/router';
import {HttpEventType} from '@angular/common/http';
import {animate, state, style, transition, trigger} from '@angular/animations';

const HttpStatus = require('http-status-codes');

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({opacity: 100})),
      transition('* => void', [
        animate(1000, style({opacity: 1})),
        animate(500, style({opacity: 0}))
      ])
    ])
  ]
})
export class DriverComponent implements OnInit {

  public appointment: IAppointmentModel;
  public data: MyType = {};
  public drivers: IEnrollmentModel[];
  public link;
  private percentDone: number;

  constructor(private appointmentService: AppointmentService, private location: Location, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.link = params.val;
    });
  }

  async ngOnInit() {
    await this.appointmentService.getAppointment(this.link, true).subscribe(sAppointment => {
      if (sAppointment.type === HttpEventType.DownloadProgress) {
        this.percentDone = Math.round(100 * sAppointment.loaded / sAppointment.total);
      } else if (sAppointment.type === HttpEventType.Response) {
        if (sAppointment.status !== HttpStatus.OK) {
          this.appointment = null;
          return;
        }

        this.appointment = sAppointment.body;

        this.drivers = this.appointment.enrollments.filter(fAppointment => fAppointment.driver !== null);

        this.data.neededTo = this.appointment.enrollments.filter(fAppointment => {
          if (fAppointment.passenger != null
            && (fAppointment.passenger.requirement === 1 || fAppointment.passenger.requirement === 2)) {
            return fAppointment;
          }
        }).length;
        this.data.gotTo = 0;
        // tslint:disable-next-line:no-unused-expression
        this.appointment.enrollments.filter(fAppointment => {
          if (fAppointment.driver != null
            && (fAppointment.driver.service === 1 || fAppointment.driver.service === 2)) {
            this.data.gotTo += fAppointment.driver.seats;
          }
        }).length;
        this.data.neededFrom = this.appointment.enrollments.filter(fAppointment => {
          if (fAppointment.passenger != null
            && (fAppointment.passenger.requirement === 1 || fAppointment.passenger.requirement === 3)) {
            return fAppointment;
          }
        }).length;
        this.data.gotFrom = 0;
        // tslint:disable-next-line:no-unused-expression
        this.appointment.enrollments.filter(fAppointment => {
          if (fAppointment.driver != null
            && (fAppointment.driver.service === 1 || fAppointment.driver.service === 3)) {
            this.data.gotFrom += fAppointment.driver.seats;
          }
        }).length;

      }
    }, error => {

    });
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
