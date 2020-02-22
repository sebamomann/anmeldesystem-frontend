import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IAppointmentModel} from '../../../../models/IAppointment.model';
import {FormArray, FormBuilder, FormControl} from '@angular/forms';

@Component({
  selector: 'app-additions',
  templateUrl: './additions.component.html',
  styleUrls: ['./additions.component.scss']
})
export class AdditionsComponent implements OnInit {

  @Output()
  save = new EventEmitter<any>();
  @Input()
  private appointment: IAppointmentModel;
  @Input()
  private button = 'Speichern';

  private event: any;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.event = this.formBuilder.group({
      additions: new FormArray([]),
      driverAddition: [false]
    });

    if (this.appointment !== undefined) {
      this.parseIntoForm();
    } else {
      this.addAddition();
    }
  }

  private parseIntoForm() {
    this.appointment.additions.forEach(fAddition => {
      this.addAddition(fAddition.name);
    });

    if (this.appointment.additions.length === 0) {
      this.addAddition();
    }

    this.event.get('driverAddition').setValue(this.appointment.driverAddition);
  }

  saveFnc() {
    if (this.event.valid) {
      const data = {
        driverAddition: this.event.get('driverAddition').value,
        additions: this.parseAdditionsFromForm(),
      };

      this.save.emit(data);
    }
  }

  private parseAdditionsFromForm() {
    const additions = [];
    this.event.controls.additions.controls.forEach(field => field.value != null ? additions.push({name: field.value}) : '');
    return additions;
  };

  private addAddition(value: string | null = null) {
    return (this.event.controls.additions as FormArray).push(new FormControl(value));
  }

  private removeAddition(index: number) {
    this.event.controls.additions.removeAt(index);
  }

  private hasAdditions() {
    return this.event.controls.additions.controls.some(addition => addition.value !== null)
      || this.event.get('driverAddition').value;
  }
}
