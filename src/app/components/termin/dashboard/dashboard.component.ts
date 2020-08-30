import {Component, OnInit} from '@angular/core';
import {AppointmentService} from '../../../services/appointment.service';
import {Router} from '@angular/router';
import {animate, query, stagger, state, style, transition, trigger} from '@angular/animations';
import {IAppointmentModel} from '../../../models/IAppointment.model';
import {AuthenticationService} from '../../../services/authentication.service';
import {AppointmentProvider} from '../appointment.provider';
import {BehaviorSubject, Observable} from 'rxjs';
import {AppointmentUtil} from '../../../_util/appointmentUtil.util';

interface IAppointmentArchive {
  year: number;
  month: number;
  appointments: IAppointmentModel[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({opacity: 100})),
      transition('* => void', [
        animate(1000, style({opacity: 1})),
        animate(500, style({opacity: 0}))
      ])
    ]),
    trigger('listAnimation', [
      transition('* => *', [ // each time the binding value changes
        query('mat-card', [
          style({opacity: 0, transform: 'scale(0.75)'}),
          stagger(100, [
            animate('0.15s', style({opacity: 1, transform: 'scale(1.05)'})),
            animate('0.075s', style({opacity: 1, transform: 'scale(1)'})),
          ])
        ], {optional: true})
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit {

  public hideTemplates = false;

  public appointment = null;
  public allowToShowEmptyHint: any;

  public _appointments$: Observable<IAppointmentModel[]>;
  public _appointmentsArchive$: Observable<IAppointmentModel[]>;
  public _appointmentsArchiveMapped$: BehaviorSubject<IAppointmentArchive[]>
    = new BehaviorSubject<IAppointmentArchive[]>(null);

  public showLegend: any;
  public appointmentsGroupedByMonthAndYear: { month: number; year: number }[];
  public totalAppointmentsLoaded = false;
  public isLoadingArchive = false;
  public hideLoadMoreArchiveAppointments = false;
  // ARCHIVE PAGINATION
  private limit = 5;
  private lastAppointmentDate: string = null;

  constructor(public appointmentService: AppointmentService, public router: Router,
              public authenticationService: AuthenticationService, private appointmentProvider: AppointmentProvider) {
  }

  /**
   * Filter out unique Month and Year combinations appearing in appointment array.<br/>
   * Returns array with unique month/year combinations
   *
   * @param appointments Array of appointments to sreach distinct combinations for
   */
  private static getDistinctMonthAndYearCombinations(appointments: IAppointmentModel[]) {
    const distinctMonthAndYearCombinations = [];
    const tmp_compareMap = new Map();
    for (const item of appointments) {
      if (!tmp_compareMap.has((new Date(item.date)).getMonth())) {
        tmp_compareMap.set((new Date(item.date)).getMonth(), true);
        distinctMonthAndYearCombinations.push({
          month: (new Date(item.date)).getMonth(),
          year: (new Date(item.date)).getFullYear(),
        });
      }
    }
    return distinctMonthAndYearCombinations;
  }

  async ngOnInit() {
    this.appointmentProvider.loadAppointments();
    this.appointmentProvider.loadAppointmentsArchive(null, this.limit);
    this.isLoadingArchive = true;

    this._appointments$ = this.appointmentProvider.appointments$;
    this._appointmentsArchive$ = this.appointmentProvider.appointmentsArchive$;

    this._appointmentsArchive$
      .subscribe(sAppointments => {
        const _lastAppointmentDate = sAppointments.slice(-1)[0].date;

        if (_lastAppointmentDate === this.lastAppointmentDate) {
          this.hideLoadMoreArchiveAppointments = true;
        }

        this.lastAppointmentDate = _lastAppointmentDate;
        this.isLoadingArchive = false;
        const output = [];

        this.appointmentsGroupedByMonthAndYear = DashboardComponent.getDistinctMonthAndYearCombinations(sAppointments);
        this.sortAppointmentsByMonthAndYearCombination(sAppointments, output);

        this._appointmentsArchiveMapped$.next(output);
      });
  }

  public redirectToAppointment(appointment: IAppointmentModel) {
    this.router
      .navigate(['/enroll'], {
        queryParams: {
          a: appointment.link
        }
      });
  }

  public onScroll() {
    this.isLoadingArchive = true;
    this.appointmentProvider.loadAppointmentsArchive(this.lastAppointmentDate, this.limit);
  }

  private sortAppointmentsByMonthAndYearCombination(sAppointments: IAppointmentModel[], output: any[]) {
    this.appointmentsGroupedByMonthAndYear
      .forEach((fMonthAndYear) => {
        const __appointments: IAppointmentModel[] = sAppointments.filter(fAppointment => {
          return AppointmentUtil.getMonth(fAppointment) === fMonthAndYear.month
            && AppointmentUtil.getYear(fAppointment) === fMonthAndYear.year;
        });

        output.push({
          month: fMonthAndYear.month,
          year: fMonthAndYear.year,
          appointments: __appointments,
        });
      });
  }
}
