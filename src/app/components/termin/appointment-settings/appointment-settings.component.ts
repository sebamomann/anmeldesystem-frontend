import {Component, OnInit} from '@angular/core';
import {AppointmentService} from '../../../services/appointment.service';
import {MatDialog} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {IAppointmentModel} from '../../../models/IAppointment.model';
import {HttpEventType} from '@angular/common/http';

@Component({
  selector: 'app-appointment-settings',
  templateUrl: './appointment-settings.component.html',
  styleUrls: ['./appointment-settings.component.scss']
})
export class AppointmentSettingsComponent implements OnInit {
  private link: any;
  private appointment: IAppointmentModel;
  private saveSuccess: boolean;

  constructor(private appointmentService: AppointmentService, public dialog: MatDialog,
              private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.link = params.a;
    });

    this.route.params.subscribe(params => {
      if (params.link !== undefined) {
        this.link = params.link;
        this.router.navigate(['/enroll'], {queryParams: {a: this.link}}).then(() => '');
      }
    });
  }

  ngOnInit() {
    this.appointmentService
      .getAppointment(this.link, false)
      .subscribe(sAppointment => {
        this.appointment = sAppointment;
      });
  }

  saveOverall(data: any) {
    this._save(data);
  }

  saveAdditions(data: any) {
    this._save(data);
  }


  saveLink(data: any) {
    this._save(data);
  }


  private _save(data: any) {
    const toChange = {};
    for (const [key, value] of Object.entries(data)) {
      if (data[key] !== this.appointment[key]) {
        toChange[key] = value;
      }
    }

    if (toChange !== {}) {
      this.appointmentService
        .updateValues(toChange, this.appointment)
        .subscribe(
          res => {
            if (res.type === HttpEventType.Response) {
              if (res.status <= 299) {
                if (this.link !== res.body.link) {
                  this.router.navigate(['/appointment/settings'], {
                    queryParams: {a: res.body.link},
                    queryParamsHandling: 'merge'
                  }).then(() => this.appointment.link = res.body.link);
                }
                this.saved();
              }
            }
          },
          error => {
          });
    }
  }

  saveAdministrators($event: any) {
  }

  saveFile($event: any) {
  }

  private saved() {
    this.saveSuccess = true;
    const self = this;
    setTimeout(() => {
      self.saveSuccess = false;
    }, 3000);
  }
}
