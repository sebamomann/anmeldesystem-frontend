import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IAppointmentModel} from '../../../../models/IAppointment.model';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';

@Component({
  selector: 'app-overall-data',
  templateUrl: './overall-data.component.html',
  styleUrls: ['./overall-data.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'de-DE'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}]
})
export class OverallDataComponent implements OnInit {

  @Output()
  save = new EventEmitter<any>();
  @Output()
  valid = false;
  @Input()
  public appointment: IAppointmentModel;
  @Input()
  public button = 'Speichern';

  public event: FormGroup;

  constructor(private formBuilder: FormBuilder, private _adapter: DateAdapter<any>) {
  }

  ngOnInit() {
    this._adapter.setLocale('de');

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

  public saveFnc() {
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
