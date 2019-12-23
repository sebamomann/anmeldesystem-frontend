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
  private filter = this.getFilter(this.appointment);
  private enrollments = this.appointment.enrollments;
  allowModify = true;

  ngOnInit() {
  }

  openFilterDialog(): void {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      width: '75%',
      height: 'auto',
      data: {
        appointment: this.appointment,
        filter: this.filter
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.filterEnrollments();
      console.log(this.appointment.enrollments.toString());
    });
  }

  getFilter(appointment: any) {
    const additions = [];
    appointment.additions.forEach(value => additions.push({id: value.id, name: value.name, active: false}));
    return additions;
  }

  filterEnrollments() {
    /* RESET */
    this.enrollments = this.appointment.enrollments;

    const BreakException = {};
    if (this.filter.filter(val => val.active).length > 0) {
      const output = [];

      this.enrollments.forEach(enrollment => {
        console.log(`enrollment: ${enrollment.name}`);
        try {
          this.filter.forEach(filter => {
            console.log(`filter: ${filter.id}`);
            let valid = true;

            enrollment.additions.forEach(id => {
              if (filter.id === id && !filter.active) {
                valid = false;
              }
              console.log(`checking: ${id} ${valid}`);
            });

            if (filter.active === true && !enrollment.additions.some(uID => uID === filter.id)) {
              valid = false;
            }

            if (!valid) {
              console.log('BREAK');
              throw BreakException;
            }
          });

          output.push(enrollment);
        } catch (e) {
          //
        }
        console.log(`---------------`);
      });
      this.enrollments = output;
    }
  }
}
