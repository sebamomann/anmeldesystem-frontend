import {Component, OnInit} from '@angular/core';
import {TerminService} from '../../../services/termin.service';
import {Router} from '@angular/router';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [ // each time the binding value changes
        query('mat-card', [
          style({opacity: 0, transform: 'scale(0.5)'}),
          stagger(100, [
            animate('0.15s', style({opacity: 1, transform: 'scale(1.05)'})),
            animate('0.075s', style({opacity: 1, transform: 'scale(1)'})),
          ])
        ])
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit {

  hide: any;
  numbers = new Array(3);
  private appointments = undefined;

  constructor(public terminService: TerminService, private router: Router) {

  }

  async ngOnInit() {
    this.terminService.getTermine().subscribe(sAppointments => {
      this.hide = true;
      setTimeout(() => {
        this.appointments = sAppointments;
      }, 1000);
    });
  }

}
