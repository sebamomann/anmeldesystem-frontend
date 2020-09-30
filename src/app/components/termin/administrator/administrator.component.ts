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
  public appointment: IAppointmentModel;
  @Input()
  public button = 'Speichern';

  public event: any;

  public administrators: any;
  public recentAdminList = [];

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
    const removeIndex = this.administrators.indexOf(data);
    this.administrators.splice(removeIndex, 1);
  }

  public pending(data: any) {
    this.recentAdminList.push(data);
  }

  unknownUserError() {
    this.event.get('username').setErrors({notFound: true});
  }

  getErrorMessage() {
    if (this.event.get('username').hasError('notFound')) {
      return 'Benutzer nicht gefunden';
    }
  }
}
