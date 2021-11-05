import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IAppointmentModel} from '../../../../models/IAppointment.model';
import {IAdditionModel} from '../../../../models/IAddition.model';
import {FormArray, FormBuilder, FormControl} from '@angular/forms';
import {IEnrollmentModel} from '../../../../models/IEnrollment.model';

@Component({
  selector: 'app-enrollment-additions',
  templateUrl: './enrollment-additions.component.html',
  styleUrls: ['./enrollment-additions.component.scss']
})
export class EnrollmentAdditionsComponent implements OnInit {

  @Output('done') done__ = new EventEmitter();
  @Output('cancel') cancel__ = new EventEmitter();

  @Input() appointment: IAppointmentModel;
  @Input() enrollment: IEnrollmentModel;
  @Input() isEdit = false;

  public form = this.formBuilder.group({
    additions: new FormArray([]),
  });

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.buildFormGroup();
  }

  public save() {
    this.done__.emit(this.getIdsOfSelectedAdditions());
  }

  public cancel() {
    this.cancel__.emit();
  }

  public getAdditionsControls() {
    return (this.form.get('additions') as FormArray).controls;
  }

  private buildFormGroup: () => void = () => {
    this.appointment.additions.forEach((o) => {
      // if output has addition with this id then set to true
      let selected = false;
      if (this.enrollment) {
        selected = this.enrollment.additions.some(iAddition => iAddition.id === o.id);
      }
      const control = new FormControl(selected);
      (this.form.controls.additions as FormArray).push(control);
    });
  };

  private getIdsOfSelectedAdditions: () => IAdditionModel[] = () => {
    const additionListRaw = this.form.value.additions
      .map((v, i) => v ? this.appointment.additions[i].id : null)
      .filter(v => v !== null);

    const additionList = [];

    additionListRaw.forEach(fAddition => {
      const addition = {id: fAddition};
      additionList.push(addition);
    });

    return additionList;
  };
}
