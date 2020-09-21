import {Component, EventEmitter, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {IAppointmentModel} from '../../../models/IAppointment.model';
import {HttpErrorResponse, HttpEventType} from '@angular/common/http';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AuthenticationService} from '../../../services/authentication.service';
import {MatSnackBar} from '@angular/material';
import {IEnrollmentModel} from '../../../models/IEnrollment.model';
import {EnrollmentService} from '../../../services/enrollment.service';
import {Observable, Subscription} from 'rxjs';
import {TokenUtil} from '../../../_util/tokenUtil.util';
import {SEOService} from '../../../_helper/_seo.service';
import {AppointmentProvider} from '../appointment.provider';
import {AppointmentUtil} from '../../../_util/appointmentUtil.util';
import {EnrollmentCreateComponent} from './enrollment-create/enrollment-create.component';
import {EnrollmentEditComponent} from './enrollment-edit/enrollment-edit.component';

const HttpStatus = require('http-status-codes');

@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.scss'],
  providers: [SEOService],
  animations: [
    trigger('fadeInOut', [
      state('in', style({opacity: 100})),
      transition('* => void', [
        animate(1000, style({opacity: 1})),
        animate(500, style({opacity: 0}))
      ])
    ]),
  ]
})
export class EnrollmentComponent implements OnInit, OnDestroy {
  static LOCAL_STORAGE_ENROLLMENT_TMP_KEY = 'enrollmentOutput';

  public userIsLoggedIn: boolean = this.authenticationService.userIsLoggedIn();

  public appointment$: Observable<IAppointmentModel>;
  public appointment: IAppointmentModel;
  public appointmentLink: string;

  public isEdit: any;

  public loaded = false;
  public sendingRequestEmit = new EventEmitter<boolean>();

  // Sending options
  public triggerDirectSend = false;

  // permission via mail
  public permissionToken: any;
  public enrollmentId: string;

  @ViewChild('enrollmentCreateRef', {static: false}) private enrollmentCreate: EnrollmentCreateComponent;
  @ViewChild('enrollmentEditRef', {static: false}) private enrollmentEdit: EnrollmentEditComponent;

  // Preparation for login redirect fields
  private appointment$$: Subscription;
  private appointmentService$$: Subscription;

  constructor(private enrollmentService: EnrollmentService, private route: ActivatedRoute,
              private router: Router, private authenticationService: AuthenticationService,
              private snackBar: MatSnackBar, private _seoService: SEOService,
              private appointmentProvider: AppointmentProvider) {
    this.route.queryParams.subscribe(params => {
      this.appointmentLink = params.a;
      this.enrollmentId = params.e;
      this.permissionToken = params.t;

      this.triggerDirectSend = params.send === 'true';

      if (this.permissionToken) {
        AppointmentUtil.storeEnrollmentPermissions(this.appointmentLink, {
          id: this.enrollmentId,
          token: this.permissionToken
        });
      }
    });
  }

  private static clearLoginAndMailFormIntercepting() {
    localStorage.removeItem(EnrollmentComponent.LOCAL_STORAGE_ENROLLMENT_TMP_KEY);
  }

  async ngOnInit() {
    this.appointment$ = this.appointmentProvider.appointment$;
    this.appointment$$ = this.appointment$
      .subscribe((sAppointment) => {
        if (sAppointment !== undefined && !this.loaded) { // CAN BE NULL !!!
          this.appointment = sAppointment;
          this.loaded = true;
          this.__SEO();
          this.main();
        } else if (!this.loaded) {
          this.appointmentProvider.loadAppointment(this.appointmentLink);
        } else {
          // IGNORE FURTHER UPDATES
        }
      });
  }

  public ngOnDestroy() {
    this.appointment$$.unsubscribe();

    if (this.appointmentService$$) {
      this.appointmentService$$.unsubscribe();
    }
  }

  /**
   * Eventually send enrollment request, depending on edit or no edit;
   */
  public sendEnrollmentRequest($event: { operation: string; enrollment: IEnrollmentModel }) {
    const functionName = $event.operation;
    const enrollment = $event.enrollment;

    setTimeout(() => { // needed so loading directive triggers again after login or sth
      this.sendingRequestEmit.emit(true);
    });

    // fetch permission token if existing
    enrollment.token = TokenUtil.getTokenForEnrollment(this.enrollmentId, this.appointmentLink);

    this.appointmentService$$ = this.enrollmentService[functionName](enrollment, this.appointment)
      .subscribe(
        result => {
          if (result.type === HttpEventType.Response) {
            if (result.status === HttpStatus.CREATED || result.status === HttpStatus.OK) {
              if (functionName === 'create') {
                this.appointment.enrollments.push(result.body);
                this.appointmentProvider.update(this.appointment);

                // enrollment assigned to user by email (not account)
                if (result.body.token) {
                  AppointmentUtil.storeEnrollmentPermissions(this.appointmentLink, {
                    id: result.body.id,
                    token: result.body.token
                  });
                }
              } else {
                this.appointment.enrollments
                  .map((mEnrollment) => mEnrollment.id === result.body.id ? result.body : mEnrollment);
              }

              this.request_success_finalize();
            }
          }
        }, (err: HttpErrorResponse) => {
          this.sendingRequestEmit.emit(false);

          if (err.status === HttpStatus.BAD_REQUEST) {
            if (err.error.code === 'DUPLICATE_ENTRY') {
              this.request_error_handleDuplicateValues(err);
            }
          } else if (err.status === HttpStatus.FORBIDDEN) {
            this.request_error_forbidden();
          }
        }
      );
  }

  private request_error_forbidden() {
    this.router.navigate([`enroll`],
      {
        queryParams: {
          a: this.appointment.link
        }
      })
      .then(() => {
        this.snackBar
          .open(`Sorry, du hast keine Berechtigung diesen Teilnehmer zu bearbeiten.`,
            '',
            {
              duration: 4000,
              panelClass: 'snackbar-error'
            }
          );
      });
  }

  private request_error_handleDuplicateValues(err: HttpErrorResponse) {
    err.error.data.forEach(fColumn => {
      if (fColumn === 'creator') {
        if (!this.isEdit) {
          this.enrollmentCreate.setCreatorError();
        }
      } else {
        if (this.isEdit) {
          this.enrollmentEdit.inUseError(fColumn);
        } else {
          this.enrollmentCreate.inUseError(fColumn);
        }
      }
    });
  }

  private request_success_finalize() {
    EnrollmentComponent.clearLoginAndMailFormIntercepting();

    this.router
      .navigate([`enroll`],
        {
          queryParams: {
            a: this.appointment.link
          }
        })
      .then(() => {
        this.sendingRequestEmit.emit(false);

        this.snackBar
          .open(`Erfolgreich ` + (this.isEdit ? 'bearbeitet' : 'angemeldet'),
            '',
            {
              duration: 2000,
              panelClass: 'snackbar-default'
            }
          );
      });
  }

  private main(): void {
    // appointment can be null if it's not found
    if (this.appointment === null) {
      return;
    }

    this.isEdit = this.enrollmentId !== undefined;
  }

  private __SEO() {
    this._seoService.updateTitle(`${this.appointment.title} - Anmelden`);
    this._seoService.updateDescription(this.appointment.title + ' - ' + this.appointment.description);
  }
}
