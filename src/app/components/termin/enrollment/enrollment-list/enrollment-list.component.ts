import {Component, Input, OnInit} from '@angular/core';
import {IAppointmentModel} from '../../../../models/IAppointment.model';
import {IEnrollmentModel} from '../../../../models/IEnrollment.model';
import {FilterDialogComponent} from '../../../dialogs/filter/filterDialog.component';
import {isObject} from 'util';
import {MatDialog, MatSnackBar} from '@angular/material';
import {CommentDialogComponent} from '../../../dialogs/comment/commentDialog.component';
import {HttpEventType} from '@angular/common/http';
import {ConfirmationDialogComponent} from '../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import {ActivatedRoute, Router, RouterStateSnapshot} from '@angular/router';
import {AppointmentService} from '../../../../services/appointment.service';
import {AuthenticationService} from '../../../../services/authentication.service';
import {EnrollmentService} from '../../../../services/enrollment.service';
import {Location} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';
import {ResendEnrollmentPermissionComponent} from '../../../dialogs/key-dialog/resend-enrollment-permission.component';
import {animate, query, stagger, state, style, transition, trigger} from '@angular/animations';

const HttpStatus = require('http-status-codes');

@Component({
  selector: 'app-enrollment-list',
  templateUrl: './enrollment-list.component.html',
  styleUrls: ['./enrollment-list.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({opacity: 100})),
      transition('* => void', [
        animate(1000, style({opacity: 1})),
        animate(500, style({opacity: 0}))
      ])
    ]),
    trigger('listAnimation', [
      transition('* => *', [
        query('mat-expansion-panel', [
          style({opacity: 0, transform: 'scale(0.9)'}),
          stagger(75, [
            animate('0.15s', style({opacity: 1, transform: 'scale(1.05)'})),
            animate('0.075s', style({opacity: 1, transform: 'scale(1)'})),
          ])
        ])
      ])
    ])
  ],
})
export class EnrollmentListComponent implements OnInit {
  public userIsLoggedIn: boolean = this.authenticationService.currentUserValue !== null;

  @Input()
  public appointment: IAppointmentModel;
  @Input()
  public enrollments: IEnrollmentModel[];
  public enrollmentsFiltered: IEnrollmentModel[];
  @Input()
  public title: string;

  public filter: any;

  public disableAnimation = true;
  @Input()
  public main = false;
  public filterGotActivated = false;

  constructor(private appointmentService: AppointmentService, public dialog: MatDialog, private route: ActivatedRoute,
              private router: Router, private authenticationService: AuthenticationService, private enrollmentService: EnrollmentService,
              private snackBar: MatSnackBar, private location: Location, private sanitizer: DomSanitizer,
              private _state: RouterStateSnapshot) {
    setTimeout(() => this.disableAnimation = false);
  }

  ngOnInit() {
    this.filter = this.initializeFilterObject(this.appointment);
    this.enrollmentsFiltered = this.enrollments;
  }

  /**
   * Remove enrollment from appointment list. Used for eliminating the need of re-fetching the entire appointment after enrollment deletion
   *
   * @param enrollment IEnrollmentModel Enrollment to delete from list
   */
  removeAppointment: (enrollment: IEnrollmentModel) => void
    = (enrollment: IEnrollmentModel) => {
    const index = this.enrollments.indexOf(enrollment);
    this.enrollments.splice(index, 1);
  };

  /**
   * Check if id of addition is checked by enrollment.
   *
   * @param enrollment IEnrollmentModel Enrollment to search in
   * @param id string ID of addition to check for
   */
  public enrollmentCheckedAddition: (enrollment: IEnrollmentModel, id: string) => boolean
    = (enrollment: IEnrollmentModel, id: string): boolean => {
    return enrollment.additions.findIndex(add => add.id === id) !== -1;
  };

  /**
   * Open dialog for setting filters for enrollment list. <br />
   * After closing, filter instantly applies and updates list of enrollments.
   *
   * @param error If error is true, then show error message, that no filter applies.
   */
  public _openFilterDialog = (error: boolean = false): void => {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      width: '80%',
      maxWidth: '500px',
      height: 'auto',
      data: {
        appointment: this.appointment,
        filter: this.filter,
        error
      },
    });

    dialogRef.afterClosed().subscribe(newFilter => {
      if (isObject(newFilter)
        && newFilter !== this.filter
        && newFilter != null) {
        this.filterGotActivated = true;
        // Preserve current data
        const curr_filter = this.filter;
        const curr_enrollments = this.enrollmentsFiltered;

        this.filter = newFilter;

        const _enrollmentsFiltered = this.filterEnrollments();

        if (_enrollmentsFiltered.length === 0
          && this.getNumberOfActiveFilter() > 0) {
          this.enrollments = curr_enrollments;
          // Reopen filter if filter shows no results
          this._openFilterDialog(true);
          // Reset filter
          this.filter = curr_filter;
        } else {
          this.enrollmentsFiltered = _enrollmentsFiltered;
        }
      } else if (newFilter === null) {
        this.filterGotActivated = false;
        this.filter = this.initializeFilterObject(this.appointment);
        this.enrollmentsFiltered = this.enrollments;
      }
    });
  };

  /**
   * Open dialog in order to see comments of enrollment. <br />
   * Dialog also gives the opportunity to create a comment.
   *
   * @param enrollment Enrollment To get comment list from and sending comments to
   */
  public _openCommentDialog = (enrollment: IEnrollmentModel): void => {
    const dialogRef = this.dialog.open(CommentDialogComponent, {
      width: '90%',
      maxWidth: 'initial',
      height: 'auto',
      maxHeight: '80vh',
      data: {enrollment},
    });

    dialogRef.afterClosed().subscribe(() => {
    });
  };

  public openResendDialog = (enrollment: IEnrollmentModel, operation: string) => {
    const dialogRef = this.dialog.open(ResendEnrollmentPermissionComponent, {
      width: '90%',
      maxWidth: 'initial',
      height: 'auto',
      maxHeight: '80vh',
      data: {
        enrollment,
        operation
      }
    });
  };

  /**
   * Filter enrollment list for applying filters set by filterDialog.
   */
  filterEnrollments: () => IEnrollmentModel[] = () => {
    if (this.filterGotActivated
      || this.filter.driverPassenger !== '') {
      const output: IEnrollmentModel[] = [];

      this.enrollments.forEach(eEnrollment => {
        try {
          if (this.filter.additions.filter(val => val.active).length > 0) {
            let contains = 0;
            this.filter.additions.forEach(eFilterAddition => {
              if (eFilterAddition.active
                && eEnrollment.additions.some(iAddition => iAddition.id === eFilterAddition.id)) {
                contains++;
              }

              eEnrollment.additions.forEach(eAddition => {
                if (eAddition.id === eFilterAddition.id
                  && !eFilterAddition.active
                  && this.filter.explicitly === 'explicit') {
                  throw new Error();
                }
              });

              if ((this.filter.explicitly === 'explicit' || this.filter.explicitly === 'semiExplicit')
                && eFilterAddition.active === true
                && !eEnrollment.additions.some(sAddition => sAddition.id === eFilterAddition.id)) {
                throw new Error();
              }
            });

            if (contains === 0 && this.filter.additions.some(cAddition => cAddition.active)) {
              return;
            }
          } else {
            if (this.filter.explicitly === 'explicit') {
              if (eEnrollment.additions.some(sAddition => sAddition)) {
                return;
              }
            }
          }

          if (this.filter.driverPassenger !== ''
            && ((eEnrollment.driver === null
              && this.filter.driverPassenger === 'driver')
              || (eEnrollment.passenger === null
                && this.filter.driverPassenger === 'passenger'))) {
            return;
          }

          output.push(eEnrollment);
        } catch (e) {
          //
        }
      });

      return output;
    }

    return [];
  };

  /**
   * Count number of active filter options. <br />
   * #selectedAdditions + (driverPassengerFilter ? 1 : 0) + (explicit ? 1 : 0)
   */
  getNumberOfActiveFilter: () => number = () => {
    if (!this.filterGotActivated) {
      return 0;
    }

    let i = 0;
    this.filter.additions.forEach(filter => {
      if (filter.active) {
        i++;
      }
    });

    if (this.filter.driverPassenger === 'driver'
      || this.filter.driverPassenger === 'passenger') {
      i++;
    }

    if (this.filter.explicitly === 'explicit'
      || this.filter.explicitly === 'dynamic'
      || this.filter.explicitly === 'semiExplicit') {
      i++;
    }

    return i;
  };

  public precheckOpenConfirmationDialog = async (enrollment: IEnrollmentModel, operation: string): Promise<void> => {
    this.allowedToEditByUserId(enrollment)
      .then(() => {
        this.permissionGranted(operation, enrollment);
        return null;
      })
      .catch(() => {
        this.allowedToEditByToken(enrollment, operation)
          .then(() => {
            this.permissionGranted(operation, enrollment);
          })
          .catch(() => {
            const currentUser = this.authenticationService.currentUserValue;
            if (currentUser && currentUser.exp > new Date()) {
              this.snackBar.open('Da ist wohl was schief gelaufen.',
                '',
                {
                  duration: 2000,
                  panelClass: 'snackbar-error'
                });
            } else {
              this.router.navigate(['/account/login'], {queryParams: {returnUrl: this._state.url, mail: currentUser.mail}});
            }
          });
      });
  };

  /**
   * Create filter object with to appointment corresponding addition list.
   *
   * @param appointment IAppointmentModel of appointment to set filter for
   *
   * // TODO set return type
   */
  private initializeFilterObject: (appointment: IAppointmentModel) => any
    = (appointment: IAppointmentModel): any => {
    const additions = [];
    appointment.additions.forEach(value => additions.push({id: value.id, name: value.name, active: false}));
    return {additions, explicitly: 'dynamic', driverPassenger: ''};
  };

  /**
   * Check for confirmation to delete the enrollment. <br />
   * On success/error show appropriate snackbar and delete enrollment from list so no re-fetch is needed
   *
   * @param enrollment Enrollment to delete
   */
  private _openConfirmationDialog = (enrollment: IEnrollmentModel): void => {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Bist du sicher, dass du "${enrollment.name}" löschen möchtest?`
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.enrollmentService
          .delete(enrollment, this.appointment.link)
          .subscribe(
            deletionResult => {
              if (deletionResult.type === HttpEventType.Response) {
                if (deletionResult.status === HttpStatus.OK) {
                  this.snackBar.open(`"${enrollment.name}" gelöscht`, null, {
                    duration: 2000,
                    panelClass: 'snackbar-default'
                  });
                  this.removeAppointment(enrollment);
                }
              }
            },
            error => {
              if (error.status === HttpStatus.FORBIDDEN) {
                this.snackBar.open(`Sorry, du hast keine Berechtigung diesen Teilnehmer zu löschen`, null, {
                  duration: 4000,
                  panelClass: 'snackbar-error'
                });
              }
            }
          );
      }
    });
  };

  private allowedToEditByUserId(enrollment: IEnrollmentModel) {
    return new Promise<boolean>((resolve, reject) => {
      if (this.userIsLoggedIn) {
        this.enrollmentService
          .allowEdit(enrollment)
          .subscribe(
            result => {
              if (result.type === HttpEventType.Response) {
                resolve(result.status === HttpStatus.OK);
              }
            },
            error => {
              reject(false);
            });
      } else {
        reject(false);
      }
    });
  }

  private allowedToEditByToken(enrollment: IEnrollmentModel, operation: string) {
    return new Promise<boolean>((resolve, reject) => {
      this.enrollmentService
        .validateToken(enrollment, this.appointment.link)
        .subscribe(
          sResult => {
            if (sResult.type === HttpEventType.Response) {
              if (sResult.status === HttpStatus.OK) {
                resolve(true);
              }
            }
            reject(false);
          },
          () => {
            this.openResendDialog(enrollment, operation);
          }
        );
    });
  }

  private permissionGranted(operation: string, enrollment: IEnrollmentModel) {
    if (operation === 'delete') {
      this._openConfirmationDialog(enrollment);
    } else if (operation === 'edit') {
      this.router.navigate(['/enrollment'], {
        queryParams:
          {
            a: this.appointment.link,
            e: enrollment.id,
            editId: null,
            editOperation: null
          },
        queryParamsHandling: 'merge'
      });
    }
  }
}
