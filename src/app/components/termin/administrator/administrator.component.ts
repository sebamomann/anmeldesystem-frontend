import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IAppointmentModel} from '../../../models/IAppointment.model';
import {FormBuilder, FormControl} from '@angular/forms';

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.scss']
})
export class AdministratorComponent implements OnInit {

  @Output()
  save = new EventEmitter<any>();
  @Input()
  private appointment: IAppointmentModel;
  @Input()
  private button = 'Speichern';

  private event: any;
  public administrators: any;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.administrators = this.appointment.administrators;

    this.event = this.formBuilder.group({
      username: new FormControl('')
    });
  }

  add() {
    this.save.emit(this.event.get('username').value);
  }

  removeAdministrator(data: any) {
    console.log('removed', JSON.stringify(data));
    const removeIndex = this.administrators.indexOf(data);
    this.administrators.splice(removeIndex, 1);
  }
}
