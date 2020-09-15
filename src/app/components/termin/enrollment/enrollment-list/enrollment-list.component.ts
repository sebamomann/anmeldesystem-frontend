import {Component, EventEmitter, Input, OnDestroy, OnInit} from '@angular/core';
import {IAppointmentModel} from '../../../../models/IAppointment.model';
import {IEnrollmentModel} from '../../../../models/IEnrollment.model';
import {FilterDialogComponent} from '../../../dialogs/filter/filterDialog.component';
import {isObject} from 'util';
import {MatDialog, MatSnackBar} from '@angular/material';
import {CommentDialogComponent} from '../../../dialogs/comment/commentDialog.component';
import {ConfirmationDialogComponent} from '../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../../../services/authentication.service';
import {EnrollmentService} from '../../../../services/enrollment.service';
import {ResendEnrollmentPermissionComponent} from '../../../dialogs/key-dialog/resend-enrollment-permission.component';
import {animate, query, stagger, state, style, transition, trigger} from '@angular/animations';
import {BehaviorSubject, Subscription} from 'rxjs';
import {AppointmentProvider} from '../../appointment.provider';

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
            animate('0.15s', style({opacity: 1, transform: 'scale(1.025)'})),
            animate('0.075s', style({opacity: 1, transform: 'scale(1)'})),
          ])
        ])
      ])
    ])
  ],
})
export class EnrollmentListComponent implements OnInit, OnDestroy {
  @Input()
  public subListTitle: string;
  @Input()
  public appointment: IAppointmentModel;
  @Input()
  public showAdditions = true;
  @Input()
  public isMain = false; // TODO change to is first
  public enrollments$: BehaviorSubject<IEnrollmentModel[]> = new BehaviorSubject<IEnrollmentModel[]>(undefined);
  public enrollments_filtered$: BehaviorSubject<IEnrollmentModel[]> = new BehaviorSubject<IEnrollmentModel[]>(undefined);
  public filter: any;
  public disableAnimation = true;
  public filterDialogApplied = true; // init true for behaviour subject appliance // DO NOT CHANGE

  public sendingRequestEmitEdit = new EventEmitter<boolean>();
  public sendingRequestEmitDelete = new EventEmitter<boolean>();

  private enrollments_unfiltered;
  private enrollments$$: Subscription;
  private checkPermission$$: Subscription;

  constructor(public dialog: MatDialog, private router: Router,
              private authenticationService: AuthenticationService,
              private enrollmentService: EnrollmentService,
              private snackBar: MatSnackBar, private appointmentProvider: AppointmentProvider) {
    setTimeout(() => this.disableAnimation = false);
  }

  @Input('enrollments') set enrollments(enrollments: IEnrollmentModel[]) {
    this.enrollments$.next(enrollments);
  };

  ngOnInit() {
    this.filter = this.initializeFilterObject(this.appointment);

    this.enrollments$$ = this.enrollments$.subscribe((enrollments) => {
      this.enrollments_unfiltered = enrollments;
      this.filterDialogApplied = true; // force filter due to observable update
      this.applyFilter();
    });
  }

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
      if (this._isNewFilter(newFilter)) {
        this.filterDialogApplied = true;

        // Preserve current data
        const _current_filter = this.filter;
        const _current_enrollments = this.enrollments_filtered$.getValue();

        this.filter = newFilter;

        this.applyFilter();

        if (this.enrollments_filtered$.getValue().length === 0
          && this.getNumberOfActiveFilter() > 0) {

          this.enrollments_filtered$.next(_current_enrollments);
          this._openFilterDialog(true); // Reopen filter if filter shows no results
          // Reset filter
          this.filter = _current_filter;
        }

      } else if (newFilter === null) {
        this.filterDialogApplied = false;
        this.filter = this.initializeFilterObject(this.appointment);
        this.enrollments_filtered$.next(this.enrollments_unfiltered);
      }
    });
  };

  /**
   * Filter enrollment list for applying filters set by filterDialog.
   */
  applyFilter: () => void = () => {
    if (this.filterDialogApplied
      || this.filter.driverPassenger !== '') {
      const output: IEnrollmentModel[] = [];

      this.enrollments_unfiltered.forEach(eEnrollment => {
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

      this.filterDialogApplied = false;

      output.sort((a, b) => {
        return a.iat > b.iat ? 1 : -1;
      });

      this.enrollments_filtered$.next(output);
      return;
    }

    this.enrollments_filtered$.next([]);
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

  public openPermissionResendDialog = (enrollment: IEnrollmentModel, operation: string) => {
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

    dialogRef.afterClosed()
      .subscribe(() => {
        this.sendingRequestEmitEdit.emit(false);
      });
  };

  /**
   * Count number of active filter options. <br />
   * #selectedAdditions + (driverPassengerFilter ? 1 : 0) + (explicit ? 1 : 0)
   */
  getNumberOfActiveFilter: (force?: boolean) => number = (force = false) => {
    if (!force) {
      if (!this.filterDialogApplied) {
        return 0;
      }
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

    if (i >= 1 &&
      (this.filter.explicitly === 'explicit'
        || this.filter.explicitly === 'dynamic'
        || this.filter.explicitly === 'semiExplicit')) {
      i++;
    }

    return i;
  };

  public preCheckOpenConfirmationDialog = async (enrollment: IEnrollmentModel, operation: string): Promise<void> => {
    if (operation === 'delete') {
      this.sendingRequestEmitDelete.emit(true);
    } else {
      this.sendingRequestEmitEdit.emit(true);
    }

    this.checkPermission$$ = this.enrollmentService
      .checkPermission(enrollment, this.appointment.link)
      .subscribe(() => {
          this.permissionGranted(operation, enrollment);
          return null;
        },
        () => {
          this.sendingRequestEmitEdit.emit(false);
          this.sendingRequestEmitDelete.emit(false);
          if (this.authenticationService.currentUserValue !== null) {
            this.snackBar.open('Fehlende Berechtigungen',
              '',
              {
                duration: 2000,
                panelClass: 'snackbar-error'
              });
          } else {
            this.openPermissionResendDialog(enrollment, operation);
          }
        });
  };

  ngOnDestroy(): void {
    this.enrollments$$.unsubscribe();
    if (this.checkPermission$$) {
      this.checkPermission$$.unsubscribe();
    }
  }

  private _isNewFilter(newFilter) {
    return isObject(newFilter)
      && newFilter !== this.filter
      && newFilter != null;
  }

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
    const name = enrollment.name ? enrollment.name : enrollment.creator.name;
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Bist du sicher, dass du "${name}" löschen möchtest?`
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this.enrollmentService
            .delete(enrollment, this.appointment.link)
            .subscribe(
              () => {
                const index = this.appointment.enrollments.indexOf(enrollment);
                this.appointment.enrollments.splice(index, 1);

                this.appointmentProvider.update(this.appointment);

                this.snackBar.open(`"${enrollment.name}" gelöscht`, null, {
                  duration: 2000,
                  panelClass: 'snackbar-default'
                });

                this.sendingRequestEmitDelete.emit(false);

                // this.removeEnrollmentFromAppointment(enrollment); // Not used due to ws
              },
              error => {
                if (error.status === HttpStatus.FORBIDDEN) {
                  this.snackBar.open(`Sorry, du hast keine Berechtigung diesen Teilnehmer zu löschen`, null, {
                    duration: 4000,
                    panelClass: 'snackbar-error'
                  });
                }

                this.sendingRequestEmitDelete.emit(false);
              }
            );
        }

        this.sendingRequestEmitDelete.emit(false);
      });
  };

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
            operation: null
          },
        queryParamsHandling: 'merge'
      }).then(() => {
        this.sendingRequestEmitEdit.emit(false);
      });
    }
  }
}
