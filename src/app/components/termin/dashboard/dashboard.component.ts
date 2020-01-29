import {Component, OnInit} from '@angular/core';
import {AppointmentService} from '../../../services/appointment.service';
import {Router} from '@angular/router';
import {animate, query, stagger, state, style, transition, trigger} from '@angular/animations';
import {HttpEventType} from '@angular/common/http';
import {IAppointmentModel} from '../../../models/IAppointment.model';
import {AuthenticationService} from '../../../services/authentication.service';

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

  hide: any;
  numbers = new Array(3);
  public percentDone;
  public appointments: IAppointmentModel[] = undefined;
  public appointmentsArchive = undefined;

  constructor(public appointmentService: AppointmentService, private router: Router,
              public authenticationService: AuthenticationService) {

  }

  async ngOnInit() {
    this.appointmentService.getAppointments(true).subscribe(result => {
      if (result.type === HttpEventType.DownloadProgress) {
        this.percentDone = Math.round(100 * result.loaded / result.total);
      } else if (result.type === HttpEventType.Response) {
        this.appointments = [];
        this.appointmentsArchive = [];
        this.hide = true;
        setTimeout(() => {
          this.appointments = result.body;
          this.appointmentsArchive = this.appointments.filter(fAppointment => Date.parse(fAppointment.date) < Date.now());
          this.appointments = this.appointments.filter(fAppointment => Date.parse(fAppointment.date) > Date.now());
        }, 500);
      }
    });
  }

  redirectToAppointment(appointment: IAppointmentModel) {
    this.router.navigate(['/enroll'], {queryParams: {a: appointment.link}});
  }

  public parseClass(appointment: IAppointmentModel) {
    return (this.isCreator(appointment)
        ? 'creator'
        : (this.isAdmin(appointment)
            ? 'admin'
            : 'enrolled'
        )
    );
  }

  private isAdmin(appointment: IAppointmentModel) {
    return appointment.administrators.some(val => {
      return val.mail === this.authenticationService.currentUserValue.mail;
    });
  }

  private isCreator(appointment: IAppointmentModel) {
    return appointment.creator.username === this.authenticationService.currentUserValue.username;
  }

}
