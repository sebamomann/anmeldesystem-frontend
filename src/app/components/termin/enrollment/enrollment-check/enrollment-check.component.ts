import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IAppointmentModel} from '../../../../models/IAppointment.model';
import {IEnrollmentModel} from '../../../../models/IEnrollment.model';

@Component({
  selector: 'app-enrollment-check',
  templateUrl: './enrollment-check.component.html',
  styleUrls: ['./enrollment-check.component.scss']
})
export class EnrollmentCheckComponent implements OnInit {

  @Output('done') done__ = new EventEmitter();
  @Output('cancel') cancel__ = new EventEmitter();

  @Input() appointment: IAppointmentModel;
  @Input() enrollment: IEnrollmentModel = undefined;
  @Input() sendingRequestEmit: EventEmitter<any>;

  constructor() {
  }

  ngOnInit() {
  }

  public save() {
    this.done__.emit();
  }

  public cancel() {
    this.cancel__.emit();
  }
}
