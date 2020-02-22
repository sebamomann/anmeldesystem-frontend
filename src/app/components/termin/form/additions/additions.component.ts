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

  private additionFormGroup: any;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.additionFormGroup = this.formBuilder.group({
      additions: new FormArray([new FormControl()]),
      driverAddition: [false]
    });

    if (this.appointment !== undefined) {
      this.parseIntoForm();
    }
  }

  addAdditionFormControlToFormArray(value: string | null = null) {
    return (this.additionFormGroup.controls.additions as FormArray).push(new FormControl(value));
  }

  removeAdditionFromFormArray(index: number) {
    this.additionFormGroup.controls.additions.removeAt(index);
  }

  formHavingAdditions() {
    return this.additionFormGroup.controls.additions.controls.some(addition => addition.value !== null)
      || this.additionFormGroup.get('driverAddition').value;
  }

  private parseIntoForm() {
    this.appointment.additions.forEach(fAddition => {
      this.addAdditionFormControlToFormArray(fAddition.name);
    });

    this.additionFormGroup.get('driverAddition').setValue(this.appointment.driverAddition);
  }
}
