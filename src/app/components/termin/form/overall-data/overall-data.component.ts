import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IAppointmentModel } from '../../../../models/IAppointment.model';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-overall-data',
  templateUrl: './overall-data.component.html',
  styleUrls: ['./overall-data.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }]
})
export class OverallDataComponent implements OnInit {

  // TODO Must supply a value for form control with name: 'description'

  @Output()
  save = new EventEmitter<any>();
  @Output()
  valid = false;
  @Input()
  public appointment: IAppointmentModel;
  @Input()
  public isEdit = false;

  public event: FormGroup;
  public valuesChanged = true;

  constructor(private formBuilder: FormBuilder, private _adapter: DateAdapter<any>, private datePipe: DatePipe) {
  }

  ngOnInit() {
    this._adapter.setLocale('de');

    this.event = this.formBuilder.group({
      title: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      deadline: new FormControl(''),
      location: new FormControl('', [Validators.required]),
      maxEnrollments: new FormControl(''),
    });

    if (this.appointment !== undefined) {
      this.parseOverallData();
    }
  }

  public saveFnc() {
    console.log("click");
    console.log(this.event.valid);

    if (this.event.valid) {
      const data = {
        title: this.get('title').value,
        date: this.get('date').value,
        deadline: this.get('deadline').value,
        location: this.get('location').value,
        maxEnrollments: this.get('maxEnrollments').value
      };

      try {

        this.save.emit(data);
      } catch (e) {
        console.log(e);
      }

    }
  }

  public getErrorMessage(str: string) {
    if (str !== '') {
      if (this.get(str).hasError('required')) {
        return 'Erforderlich';
      }
    }
  }

  private parseOverallData() {
    let deadline = null;
    if (this.appointment.deadline) {
      const _deadline = new Date(this.appointment.deadline);
      deadline = this.datePipe.transform(_deadline, 'yyyy-MM-ddTHH:mm');
    }

    let date = null;
    if (this.appointment.date) {
      const _date = new Date(this.appointment.date);
      date = this.datePipe.transform(_date, 'yyyy-MM-ddTHH:mm');
    }

    this.event.setValue({
      title: this.appointment.title,
      date,
      deadline,
      location: this.appointment.location,
      maxEnrollments: this.appointment.maxEnrollments ? this.appointment.maxEnrollments : ''
    });

    const eventSnapshot = this.event.value;

    this.event.valueChanges.subscribe(
      result => {
        this.valuesChanged = JSON.stringify(result) === JSON.stringify(eventSnapshot);
      }
    );
  }

  private get(str: string) {
    return this.event.get(str);
  }
}
