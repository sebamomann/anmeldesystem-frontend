import {Component, OnInit, ViewChild} from '@angular/core';
import {AppointmentService} from '../../../services/appointment.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {IAppointmentModel} from '../../../models/IAppointment.model';
import {HttpErrorResponse, HttpEventType} from '@angular/common/http';
import {LinkDataComponent} from '../form/link-data/link-data.component';

@Component({
  selector: 'app-appointment-settings',
  templateUrl: './appointment-settings.component.html',
  styleUrls: ['./appointment-settings.component.scss']
})
export class AppointmentSettingsComponent implements OnInit {
  @ViewChild(LinkDataComponent, null)
  linkDataComponent: LinkDataComponent;

  private link: any;
  private appointment: IAppointmentModel;
  private saveSuccess: boolean;
  private uploadingFile: any = [];
  private error: any = [];
  private permission = null;

  constructor(private appointmentService: AppointmentService, public dialog: MatDialog,
              private route: ActivatedRoute, private router: Router,
              private snackBar: MatSnackBar) {
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

  async ngOnInit() {
    (await this.appointmentService.hasPermission(this.link))
      .subscribe(res => {
        if (res.type === HttpEventType.Response) {
          if (res.body === true) {
            this.permission = true;
            this.appointmentService
              .getAppointment(this.link, false)
              .subscribe(sAppointment => {
                this.appointment = sAppointment;
              });
          } else {
            this.permission = false;
            const router = this.router;
            setTimeout(() => {
              router.navigate(['/enroll'], {queryParamsHandling: 'merge'});
            }, 2000);
          }
        }
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
                  this.appointment.link = res.body.link;
                  this.router.navigate(['/appointment/settings'], {
                    queryParams: {a: res.body.link},
                    queryParamsHandling: 'merge'
                  });
                }
                this.saved();
              }
            }
          },
          error => {
            if (error instanceof HttpErrorResponse) {
              if (error.status === 400) {
                if (error.error.code === 'ER_DUP_ENTRY') {
                  error.error.error.columns.forEach(fColumn => {
                      if (fColumn === 'link') {
                        this.linkDataComponent.updateErrors({attr: 'link', error: 'inUse'});
                      }
                    }
                  );
                }
              }
            }
          });
    }
  }

  saveAdministrators(data: any) {
    this.appointmentService
      .addAdministrator(data, this.appointment)
      .subscribe(
        res => {
          if (res.type === HttpEventType.Response) {
            if (res.status <= 299) {
              this.snackBar.open('Hinzugefügt', null, {
                duration: 2000,
                panelClass: 'snackbar-default'
              });
            }
          }
        },
        err => {
          console.log(err);
          if (err instanceof HttpErrorResponse) {
            if (err.status === 400) {
              this.snackBar.open('Benutzer nicht gefunden', null, {
                duration: 2000,
                panelClass: 'snackbar-error'
              });
            }
          }
        });
  }

  saveFile(data: any) {
    const d = new Date();
    const n = d.getMilliseconds();
    this.uploadingFile.push({index: n, name: data.name, progress: 0});
    this.appointmentService
      .addFile(data, this.appointment)
      .subscribe(
        res => {
          if (res.type === HttpEventType.UploadProgress) {
            this.uploadingFile.forEach(fFile => {
              if (fFile.index === n) {
                fFile.progress = Math.round(100 * res.loaded / res.total);
              }
            });
          } else if (res.type === HttpEventType.Response) {
            if (res.status <= 299) {
              this.snackBar.open('Hinzugefügt', null, {
                duration: 2000,
                panelClass: 'snackbar-default'
              });
            }
          }
        },
        err => {
          console.log(err);
          if (err instanceof HttpErrorResponse) {
            if (err.status === 400) {
              this.snackBar.open('Sorry, etwas hat nicht geklappt', null, {
                duration: 2000,
                panelClass: 'snackbar-error'
              });
            }
          }
        });
  }

  private saved() {
    this.saveSuccess = true;
    const self = this;
    setTimeout(() => {
      self.saveSuccess = false;
    }, 3000);
  }
}
