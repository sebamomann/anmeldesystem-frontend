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

  public numberOfTemplates = new Array(3);

  public appointment = null;
  public appointmentsArchive = undefined;
  public allowToShowEmptyHint: any;

  public _appointments$: Observable<IAppointmentModel[]>;
  public _appointments: IAppointmentModel[];

  public showLegend: any;

  constructor(public appointmentService: AppointmentService, public router: Router,
              public authenticationService: AuthenticationService, private appointmentProvider: AppointmentProvider) {

  }

  async ngOnInit() {
    this.appointmentProvider.loadAppointments();

    this._appointments$ = this.appointmentProvider.appointments$;

    this._appointments$
      .subscribe(result => {
        if (result === null) {
          this.hideTemplates = true;
        } else if (result !== undefined) {
          this._appointments = [];
          this.appointmentsArchive = [];

          this.hideTemplates = true;

          setTimeout(() => {
            this._appointments = result;

            this.appointmentsArchive = this._appointments.filter(fAppointment => Date.parse(fAppointment.date) < Date.now());
            this._appointments = this._appointments.filter(fAppointment => Date.parse(fAppointment.date) > Date.now());

            this.allowToShowEmptyHint = true;
          }, 250);
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
}
