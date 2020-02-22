import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IAppointmentModel} from '../../../../models/IAppointment.model';

@Component({
  selector: 'app-overall-data',
  templateUrl: './overall-data.component.html',
  styleUrls: ['./overall-data.component.scss']
})
export class OverallDataComponent implements OnInit {

  @Output()
  save = new EventEmitter<any>();
  @Output()
  valid = false;
  @Input()
  private appointment: IAppointmentModel;
  @Input()
  private button = 'Speichern';

  private event: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.event = this.formBuilder.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      deadline: [''],
      location: ['', Validators.required],
      maxEnrollments: [''],
    });

    if (this.appointment !== undefined) {
      this.parseOverallData();
    }
  }

  private parseOverallData() {
    this.event.setValue({
      title: this.appointment.title,
      date: this.appointment.date,
      deadline: this.appointment.deadline,
      location: this.appointment.location,
      maxEnrollments: this.appointment.maxEnrollments
    });
  }

  private saveFnc() {
    if (this.event.valid) {
      const data = {
        title: this.get('title').value,
        date: this.get('date').value,
        deadline: this.get('deadline').value,
        location: this.get('location').value,
        maxEnrollments: this.get('maxEnrollments').value
      };

      this.save.emit(data);
    }
  }

  private get(str: string) {
    return this.event.get(str);
  }
}
