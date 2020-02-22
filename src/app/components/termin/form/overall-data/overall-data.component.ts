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
  @Input()
  private appointment: IAppointmentModel;
  @Input()
  private button = 'Speichern';

  private dataFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.dataFormGroup = this.formBuilder.group({
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
    this.dataFormGroup.setValue({
      title: this.appointment.title,
      date: this.appointment.date,
      deadline: this.appointment.deadline,
      location: this.appointment.location,
      maxEnrollments: this.appointment.maxEnrollments
    });
  }

  private saveFnc() {
    const data = {};
    this.save.emit(data);
  }
}
