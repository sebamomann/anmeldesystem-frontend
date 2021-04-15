import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AppointmentService} from '../../../services/appointment.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {IAppointmentModel} from '../../../models/IAppointment.model';
import {HttpErrorResponse, HttpEventType} from '@angular/common/http';
import {LinkDataComponent} from '../form/link-data/link-data.component';
import {Observable, Subscription} from 'rxjs';
import {AppointmentProvider} from '../appointment.provider';
import {AdministratorComponent} from '../administrator/administrator.component';

const HttpStatus = require('http-status-codes');

@Component({
  selector: 'app-appointment-settings',
  templateUrl: './appointment-settings.component.html',
  styleUrls: ['./appointment-settings.component.scss']
})
export class AppointmentSettingsComponent implements OnInit, OnDestroy {
  @ViewChild(LinkDataComponent, null)
  linkDataComponentRef: LinkDataComponent;

  @ViewChild(AdministratorComponent, null)
  administratorComponentRef: AdministratorComponent;

  public appointment$: Observable<IAppointmentModel>;

  public link: any;
  public appointment: IAppointmentModel;
  public saveSuccess: boolean;
  public uploadingFiles: any = [];
  public permission = null;

  private appointment$$: Subscription;

  constructor(private appointmentService: AppointmentService, public dialog: MatDialog,
              private route: ActivatedRoute, private router: Router,
              private snackBar: MatSnackBar,
              private appointmentProvider: AppointmentProvider) {
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
    this.appointment$ = this.appointmentProvider.appointment$;

    (await this.appointmentService.getAppointmentManagementRelations(this.link))
      .subscribe((res) => {
        if (res.type === HttpEventType.Response) {
          this.permission = true;

          this.appointment$ = this.appointmentProvider.appointment$;

          if (!this.appointmentProvider.hasValue()) {
            this.appointmentProvider.loadAppointment(this.link);
          }

          this.listenForChange();
        }
      }, () => {
        this.permission = false;
      });
  }

  public listenForChange() {
    this.appointment$$ = this.appointment$
      .subscribe((val) => {
        if (!this.appointment) {
          this.appointment = val;
        }
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

              this.administratorComponentRef.pending(data);
            }
          }
        },
        err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 404) {
              this.administratorComponentRef.unknownUserError();
            }
          }
        });
  }

  saveFile(data: any) {
    const d = new Date();
    const n = d.getMilliseconds();
    this.uploadingFiles.push({index: n, name: data.name, progress: 0});
    this.appointmentService
      .addFile(data, this.appointment)
      .subscribe(
        res => {
          if (res.type === HttpEventType.UploadProgress) {
            this.uploadingFiles.forEach(fFile => {
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
            this.snackBar.open('Sorry, etwas hat nicht geklappt!', null, {
              duration: 2000,
              panelClass: 'snackbar-error'
            });

            this.uploadingFiles.forEach(fFile => {
              if (fFile.index === n) {
                fFile.progress = undefined;
              }
            });
          }
        });
  }

  ngOnDestroy(): void {
    if (this.appointment$$) {
      this.appointment$$.unsubscribe();
    }
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
                if (data.link && this.link !== data.link) {
                  this.appointment.link = data.link ? data.link : this.link;
                  this.router.navigate(['/appointment/settings'], {
                    queryParams: {a: this.link},
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
                        this.linkDataComponentRef.updateErrors({attr: 'link', error: 'inUse'});
                      }
                    }
                  );
                }
              }
            }
          });
    }
  }

  private saved() {
    this.saveSuccess = true;
    const self = this;
    setTimeout(() => {
      self.saveSuccess = false;
    }, 3000);
  }
}
