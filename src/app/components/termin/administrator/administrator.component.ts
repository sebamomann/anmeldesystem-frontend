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
  public administrators: string[] = [
    'benutzer1@sebamomann.de',
    'text@example.de',
    'mama@mia.com',
    'foo@bar.tld',
    'hallo@helmut.rofl'];
  @Input()
  private appointment: IAppointmentModel;
  @Input()
  private button = 'Speichern';
  private event: any;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.event = this.formBuilder.group({
      name: new FormControl()
    });
  }

}
