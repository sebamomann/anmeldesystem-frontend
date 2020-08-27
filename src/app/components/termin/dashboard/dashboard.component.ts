import {Component, OnInit} from '@angular/core';
import {AppointmentService} from '../../../services/appointment.service';
import {Router} from '@angular/router';
import {animate, query, stagger, state, style, transition, trigger} from '@angular/animations';
import {IAppointmentModel} from '../../../models/IAppointment.model';
import {AuthenticationService} from '../../../services/authentication.service';
import {AppointmentProvider} from '../appointment.provider';
import {Observable} from 'rxjs';

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
  public appointmentsArchive: { year: number, month: number, appointments: IAppointmentModel[] }[] = [];
  public allowToShowEmptyHint: any;

  public _appointments$: Observable<IAppointmentModel[]>;
  public _appointments: IAppointmentModel[] = [];
  public _appointmentsTotal: IAppointmentModel[] = [];

  public showLegend: any;
  public appointmentsGroupedByMonthAndYear: { month: number; year: number }[];
  public totalAppointmentsLoaded = false;
  private limit = 5;

  constructor(public appointmentService: AppointmentService, public router: Router,
              public authenticationService: AuthenticationService, private appointmentProvider: AppointmentProvider) {
  }

  private static getDistinctMonthAndYearCombinations(tmpArchive: any[]) {
    const distinctMonthAndYearCombinations = [];
    const tmp_compareMap = new Map();
    for (const item of tmpArchive) {
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
    this.appointmentProvider.loadAppointments(null, this.limit);

    this._appointments$ = this.appointmentProvider.appointments$;

    this._appointments$
      .subscribe(result => {
        if (result === null) {
          this.hideTemplates = true;
        } else if (result !== undefined) {
          this.totalAppointmentsLoaded = result.length !== this.limit;

          this._appointments = [];
          this.appointmentsArchive = [];

          let tmpArchive = [];

          // because a appointment is not returned twice in the sma result you can map before
          const mapped = this._appointmentsTotal.map((e) => e.id);
          result.forEach(fAppointment => {
            if (mapped.indexOf(fAppointment.id) === -1) {
              this._appointmentsTotal.push(fAppointment);
            }
          });

          tmpArchive = this._appointmentsTotal.filter(fAppointment => Date.parse(fAppointment.date) < Date.now());
          this._appointments = this._appointmentsTotal.filter(fAppointment => Date.parse(fAppointment.date) > Date.now());

          this.appointmentsGroupedByMonthAndYear = DashboardComponent.getDistinctMonthAndYearCombinations(tmpArchive);

          this.appointmentsGroupedByMonthAndYear.forEach((fMonthAndYear) => {
            const __appointments: IAppointmentModel[] = tmpArchive
              .filter(fAppointment => (new Date(fAppointment.date)).getMonth() === fMonthAndYear.month
                && (new Date(fAppointment.date)).getFullYear() === fMonthAndYear.year);

            this.appointmentsArchive.push({
              month: fMonthAndYear.month,
              year: fMonthAndYear.year,
              appointments: __appointments,
            });
          });

          this.allowToShowEmptyHint = true;

          this.hideTemplates = true;
        }
      });
  }

  redirectToAppointment(appointment: IAppointmentModel) {
    this.router
      .navigate(['/enroll'], {
        queryParams: {
          a: appointment.link
        }
      });
  }

  onScroll() {
    this.appointmentProvider.loadAppointments(this._appointmentsTotal[this._appointmentsTotal.length - 1].date, this.limit);
  }
}
