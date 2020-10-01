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
  @Output()
  back = new EventEmitter<any>();
  @Input()
  public appointment: IAppointmentModel;
  @Input()
  public isEdit = false;

  public event: any;
  public sameValues = true;

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

    const eventSnapshot = this.event.value;

    this.event.valueChanges.subscribe(
      result => {
        this.sameValues = JSON.stringify(result) === JSON.stringify(eventSnapshot);
      }
    );
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

  public addAddition(value: string | null = null) {
    return (this.event.controls.additions as FormArray).push(new FormControl(value));
  }

  public removeAddition(index: number) {
    this.event.controls.additions.removeAt(index);
  }

  public hasAdditions() {
    return this.event.controls.additions.controls.some(addition => addition.value !== null)
      || this.event.get('driverAddition').value;
  }

  public goBack() {
    this.back.emit();
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

  private parseAdditionsFromForm() {
    const additions = [];
    this.event.controls.additions.controls.forEach(field => field.value != null ? additions.push({name: field.value}) : '');
    return additions;
  };
}
