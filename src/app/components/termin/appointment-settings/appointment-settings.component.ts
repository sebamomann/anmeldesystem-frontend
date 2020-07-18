import {Component, OnInit, ViewChild} from '@angular/core';
import {AppointmentService} from '../../../services/appointment.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {IAppointmentModel} from '../../../models/IAppointment.model';
import {HttpErrorResponse, HttpEventType} from '@angular/common/http';
import {LinkDataComponent} from '../form/link-data/link-data.component';

const HttpStatus = require('http-status-codes');

@Component({
  selector: 'app-appointment-settings',
  templateUrl: './appointment-settings.component.html',
  styleUrls: ['./appointment-settings.component.scss']
})
export class AppointmentSettingsComponent implements OnInit {
  @ViewChild(LinkDataComponent, null)
  linkDataComponent: LinkDataComponent;

  public link: any;
  public appointment: IAppointmentModel;
  public saveSuccess: boolean;
  public uploadingFile: any = [];
  private error: any = [];
  public permission = null;

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
        this.permission = true;
        this.appointmentService
          .getAppointment(this.link, false)
          .subscribe(sAppointment => {
            this.appointment = sAppointment;
          });
      }, () => {
        this.permission = false;
        const router = this.router;
        setTimeout(() => {
          router.navigate(['/enroll'], {queryParamsHandling: 'merge'});
        }, 2000);
      });
  }

  saveOverall(data: any) {
    this._save(data);
    this.appointment.title = data.title;
  }

  saveAdditions(data: any) {
    this._save(data);
  }


  saveLink(data: any) {
    this._save(data);
  }

  saveOther(data: any) {
    this._save(data);
  }


  private _save(data: any) {
    const toChange = {};
    for (const [key, value] of Object.entries(data)) {
      if (data[key] !== this.appointment[key]) {
        toChange[key] = value;
      }
    }

    if (JSON.stringify(toChange) !== JSON.stringify({})) {
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
              if (error.status === HttpStatus.BAD_REQUEST) {
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

              // TODO ADD ADMIN TO LIST
              // MAYBE ALSO FORCE ADMIN TO ACCEPT CIA MAIL
            }
          }
        },
        err => {
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
