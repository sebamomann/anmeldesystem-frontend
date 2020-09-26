import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {IEnrollmentModel} from '../../../../models/IEnrollment.model';
import {IAppointmentModel} from '../../../../models/IAppointment.model';

@Component({
  selector: 'app-enrollment-details',
  templateUrl: './enrollment-details.component.html',
  styleUrls: ['./enrollment-details.component.scss']
})
export class EnrollmentDetailsComponent implements OnInit, OnChanges {

  @Input() appointment: IAppointmentModel;
  @Input() enrollment: IEnrollmentModel;
  @Input() showAdditions = true;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
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

}
