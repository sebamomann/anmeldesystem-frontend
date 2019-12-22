import {Component, NgModule, OnInit} from '@angular/core';
import {TerminService} from '../../services/termin.service';
import {MatDialog} from '@angular/material';
import {FilterDialogComponent} from '../dialogs/filter/filterDialog.component';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
@NgModule({})
export class AppointmentComponent implements OnInit {

  constructor(private terminService: TerminService, public dialog: MatDialog) {
  }

  private appointment = this.terminService.getTermin('');
  private enrollments = this.appointment.enrollments;
  private activeFilter = ['diver'];
  allowModify = true;

  ngOnInit() {
  }

  openFilterDialog(): void {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      width: '75%',
      height: 'auto',
      data: {
        appointment: this.appointment,
        activeFilter: this.activeFilter
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
