import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IAppointmentModel} from '../../../../models/IAppointment.model';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.scss']
})
export class OtherComponent implements OnInit {

  @Output()
  save = new EventEmitter<any>();
  @Input()
  public button = 'Speichern';
  public event: FormGroup;
  public sameValues = true;
  @Input()
  private appointment: IAppointmentModel;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.event = this.formBuilder.group({
      hidden: new FormControl(''),
    });

    if (this.appointment !== undefined) {
      this.parseIntoForm();
    }

    const eventSnapshot = this.event.value;

    this.event.valueChanges.subscribe(
      result => {
        this.sameValues = JSON.stringify(result) === JSON.stringify(eventSnapshot);
      }
    );
  }

  public saveFnc() {
    const data = {
      hidden: this.get('hidden').value,
    };

    this.save.emit(data);
  }

  private parseIntoForm() {
    this.event.setValue({
      hidden: this.appointment.hidden,
    });
  }

  private get(str: string) {
    return this.event.get(str);
  }
}
